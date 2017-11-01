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
        {{exam.english}} : <input type="text" class="form-control">
      </div>
      <br>
      <button v-on:click="redo(redoAction)" v-if= "redoText" class="btn btn-success">{{ redoText }}</button>
      <button v-on:click="next(nextAction)" v-if= "nextText" class="btn btn-warning">{{ nextText }}</button>
    </div>

    <div class="result" v-if="resultWindow">
      <h2>result</h2>
      <button v-on:click="redo(redoAction)" v-if= "redoText" class="btn btn-success">{{ redoText }}</button>
      <button v-on:click="next(nextAction)" v-if= "nextText" class="btn btn-warning" :disabled=" redoAction==='4' ">{{ nextText }}</button>
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
      var vm = this;
      vm.wave += 1;
      new Promise(function(resolve, reject){
        vm.getExam(function(exam) {
          resolve(exam);
        });
      }).then(function(exam){
        vm.originExams = exam;
        vm.switchWindowSetup(exam, "exam");
        vm.countDown(10, function(){
          vm.switchWindowSetup(exam, "input");
        });
      });
    },
    redo (switchCase) {
      switch (switchCase) {
        case "1":
          console.log(switchCase);
          break;
        case "4":
          console.log(switchCase);
          break;
      }
    },
    next (switchCase) {
      switch (switchCase) {
        case "2":
          console.log(switchCase);
          break
        case "3":
          console.log(switchCase);
          break;
      }
    },
    init () {
    },
    switchWindowSetup (exam, switchCase) {
      var vm = this;
      switch (switchCase) {
        case "exam":
          console.log("exam");
          vm.examWindow = true; vm.inputWindow = false; vm.resultWindow = false;
          vm.examWindowSetup(exam);
          break;
        case "input":
          vm.examWindow = false; vm.inputWindow = true; vm.resultWindow = false;
          vm.redoAction = "1"; vm.nextAction = "2"
          vm.inputWindowSetup(exam);
          break;
        case "result":
          vm.examWindow = false; vm.inputWindow = false; vm.resultWindow = true;
          if (!exam.mistake) {
            vm.redoAction = "1"; vm.nextAction = "3"
          } else {
            vm.redoAction = "4"; vm.nextAction = "3"
          }
          vm.resultWindowSetup(exam);
          break
      }
    },
    examWindowSetup (exams) {
      var vm = this;
      vm.exams = exams;
    },
    inputWindowSetup (exams) {
      var vm = this;
      vm.exams = vm.arrayShuffle(exams);
      vm.redoText = "覚え直す";
      vm.nextText = "採点";
    },
    resultWindowSetup () {
    },
    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ private
    getExam: function(ret) {
      var self = this
        axios.get(`/learn`).then(function (response) {
          console.log("getExam");
          console.log(response.data);
          ret(response.data)
          // return response.data
        }).catch(function (error) {
          console.log(error);
        });
    },
    arrayShuffle: function(array){
      for(var i = array.length - 1; i > 0; i--){
        var r = Math.floor(Math.random() * (i + 1));
        var tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
      }
      return array
    },
    mistake: function() {
      var self = this;
      var exams = self.exams;
      var ary = [];
      for( var i = 0; i < exams.length; i++ ){
        if (!(exams[i].resultB)) {
          exams[i].result = null;
          exams[i].input =  null;
          ary.push(exams[i]);
        };
      };
      return ary;
    },
    countDown: function(par, ret) {
      var self = this;
      var timer;
      var promise = new Promise(function(resolve, reject){
        timer = window.setInterval(function(){
          var rate = (par -= 2);
          self.remainingTimeValue = {width: (rate + '%')};
          if (rate <= 0){
            resolve();
          };
        },1000);
      })
      promise.then(function(){
        clearInterval(timer);
        ret(); // return
      }).catch(function(e) {
        alert("Error:" + e)
      })
    },
  },

}
</script>
