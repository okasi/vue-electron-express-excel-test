<template>
  <div class="home pb-6">
    <img class="mx-auto h-32 w-32 object-contain" src="../assets/hb.png" />

    <a-upload-dragger
      class="flex flex-col items-center mt-6 mx-auto max-w-6xl"
      accept=".xlsx,.xls"
      :multiple="false"
      :showUploadList="{
        showPreviewIcon: true,
        showRemoveIcon: false,
      }"
      :beforeUpload="handleBeforeUpload"
      @change="handleChange"
    >
      <!-- <a-button> <a-icon type="upload" /> Upload </a-button> -->
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">Click or drag file to this area to upload</p>
      <p class="ant-upload-hint">
        Support for a single upload.
      </p>
    </a-upload-dragger>

    <a-table
      class="bg-gray-200 max-w-6xl mx-auto overflow-x-auto rounded"
      :columns="columns"
      :dataSource="data"
      :pagination="false"
      bordered
    >
      <a slot="name" slot-scope="text">{{ text }}</a>
      <a
        class="font-extrabold"
        href="javascript:;"
        slot="action"
        slot-scope="record"
        @click="handlePrint(record)"
        >Print</a
      >
    </a-table>
    <div ref="content" id="content" class="hidden">
      {{ record && record.name }}
      Hello world
    </div>
  </div>
</template>

<script>
// const ky = require('ky/umd');
import * as _ from 'lodash';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
  name: 'Home',
  data() {
    return {
      columns: null,
      data: null,
      record: null,
    };
  },
  methods: {
    handleBeforeUpload() {
      return false;
    },
    async handleChange({ file, fileList }) {
      const formData = new FormData();
      formData.append('file', file);
      const data = await (
        await fetch('http://localhost:3000/getjsonfromexcel', {
          method: 'POST',
          body: formData,
        })
      ).json();

      const woTitle = _.filter(data, (arr) => {
        return arr.length > 1;
      });

      const colHeaders = woTitle[0];

      let finalData = [];
      _.forEach(woTitle, (arr, index) => {
        if (index != 0) {
          return finalData.push({
            ..._.zipObject(colHeaders, arr),
            key: index - 1,
          });
        }
      });

      let uniquifiedHeaders = [];
      _.forEach(colHeaders, (value) => {
        return uniquifiedHeaders.push({
          dataIndex: value,
          title: value,
          key: value,
          sorter: (a, b) => a[value]?.localeCompare(b[value]),
        });
      });
      uniquifiedHeaders.push({
        title: 'Action',
        key: 'operation',

        scopedSlots: { customRender: 'action' },
      });
      this.$data.columns = uniquifiedHeaders;
      this.$data.data = finalData;
    },
    handlePrint(record) {
      console.log(record);
      this.$data.record = record;
      document.getElementById('content').classList.remove('hidden');
      const doc = new jsPDF();
      const canvasElement = document.createElement('canvas');
      html2canvas(this.$refs.content, {
        canvas: canvasElement,
        backgroundColor: null,
        width: 1400,
        height: 900,
      }).then((canvas) => {
        const img = canvas.toDataURL('image/png', 0.8);
        doc.addImage(img, 'png', 20, 20);
        const date = new Date();
        const filename =
          date.getFullYear() +
          ('0' + (date.getMonth() + 1)).slice(-2) +
          ('0' + date.getDate()).slice(-2) +
          ('0' + date.getHours()).slice(-2) +
          ('0' + date.getMinutes()).slice(-2) +
          ('0' + date.getSeconds()).slice(-2) +
          '.pdf';
        doc.save(filename);
      });
      document.getElementById('content').classList.add('hidden');
    },
  },
};
</script>
