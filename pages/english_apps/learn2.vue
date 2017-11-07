<template>
  <div id="app">
    <h2>{{title}}</h2>
    <select id="select-lang" name="lang" class="btn">
      <option value="english">日本語</option>
      <option value="japanese">英語</option>
    </select>
    <button v-on:click="start" :disabled="wave >= 1" class="btn">スタート</button>
    <br> <br>
    <div class="progress">
      <div class="progress-bar progress-bar-danger progress-bar-striped" id="count_down"  role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" :style="remainingTimeValue"> </div>
    </div>
    <br>

    <div class="exam" v-if="examWindow">
      <h2>exam</h2>
      <h1 v-if="message">{{message}}</h1>
      <div v-for="exam in exams">
        {{exam.english}} : {{ exam.japanese }}
      </div>
    </div>

    <div class="input" v-if="inputWindow">
      <h2>input</h2>
      <div v-for="exam in exams">
        {{exam.english}} : <input type="text" v-model="exam.input" class="form-control">
      </div>
      <br>
      <button v-on:click="button(redoAction)" v-if= "redoText" class="btn btn-success">{{ redoText }}</button>
      <button v-on:click="button(nextAction)" v-if= "nextText" class="btn btn-warning">{{ nextText }}</button>
    </div>

    <div class="result" v-if="resultWindow">
      <h2>result</h2>
      <button v-on:click="button(redoAction)" v-if= "redoText" class="btn btn-success">{{ redoText }}</button>
      <button v-on:click="button(nextAction)" v-if= "nextText" class="btn btn-warning" :disabled=" redoAction==='4' ">{{ nextText }}</button>
    </div>

  </div>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  data () {
    return {
      title: "暗記",
      message: "",
      redoText: "", nextText: "", redoAction: "", nextAction: "",
      examWindow: false, inputWindow: false, resultWindow: false,
      exams: [], originExams: [],
      wave: 0,
      remainingTimeValue: {width: "100%"}
    }
  },
  methods: {
    start () { //startButton on click program
      let vm = this;
      vm.wave++;
      new Promise((resolve, reject) => {
        vm.getExam(exam => {
          resolve(exam);
        });
      }).then(exam => {
        vm.originExams = exam;
        vm.switchWindowSetup(exam, "exam");
        vm.countDown(10, () => {
          vm.switchWindowSetup(exam, "input");
        });
      });
    },
    button (switchCase) {
      let vm = this;
      switch (switchCase) {
        case "1": //覚え直す
          vm.switchWindowSetup(vm.originExams, "exam")
          console.log(switchCase);
          break
        case "2": //採点
          console.log(switchCase);
          break
        case "3": // 次の問題
          console.log(switchCase);
          break;
        case "4": //やり直す
          console.log(switchCase);
          break;
      }
    },
    init () {
    },
    switchWindowSetup (exam, switchCase) {
      let vm = this;
      switch (switchCase) {
        case "exam":
          vm.examWindowSetup(exam);
          break;
        case "input":
          vm.inputWindowSetup(exam);
          break;
        case "result":
          vm.resultWindowSetup(exam);
          break
      }
    },
    examWindowSetup (exams) {
      let vm = this;
      vm.examWindow = true; vm.inputWindow = false; vm.resultWindow = false;
      vm.exams = exams;
    },
    inputWindowSetup (exams) {
      let vm = this;
      vm.exams = vm.arrayShuffle(exams);
      vm.examWindow = false; vm.inputWindow = true; vm.resultWindow = false;
      vm.redoAction = "1"; vm.nextAction = "2"
      vm.redoText = "覚え直す";
      vm.nextText = "採点";
    },
    resultWindowSetup () {
      let vim = this;
      vm.examWindow = false; vm.inputWindow = false; vm.resultWindow = true;
      if (!exam.mistake) {
        vm.redoAction = "1"; vm.nextAction = "3"
      } else {
        vm.redoAction = "4"; vm.nextAction = "3"
      }
    },
    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ private
    getExam (ret) {
      let self = this
        axios.get(`/learn`).then( response => {
          console.log("getExam");
          console.log(response.data);
          ret(response.data)
          // return response.data
        }).catch( error => {
          console.log(error);
        });
    },
    arrayShuffle (array) {
      for(let i = array.length - 1; i > 0; i--){
        let r = Math.floor(Math.random() * (i + 1));
        let tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
      }
      return array
    },
    mistake () {
      let self = this;
      let exams = self.exams;
      let ary = [];
      for( let i = 0; i < exams.length; i++ ) {
        if (!(exams[i].resultB)) {
          exams[i].result = null;
          exams[i].input =  null;
          ary.push(exams[i]);
        };
      };
      return ary;
    },
    countDown (par, ret) {
      let self = this;
      let timer;
      const promise = new Promise((resolve, reject) => {
        timer = window.setInterval(() => {
          var rate = (par -= 2);
          self.remainingTimeValue = {width: (rate + '%')};
          if (rate <= 0){
            resolve();
          };
        },1000);
      })
      promise.then(() => {
        clearInterval(timer);
        ret(); // return
      }).catch( e => {
        alert("Error:" + e)
      })
    },
  },

}
</script>
