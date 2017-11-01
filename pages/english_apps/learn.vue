<template>
  <div id="app">
    <h2>{{title}}</h2>
    <select id="select-lang" name="lang" class="btn">
      <option value="english">日本語</option>
      <option value="japanese">英語</option>
    </select>
    <button v-on:click="start" :disabled="startButton" class="btn">スタート</button>
    <br> <br>
    <div class="progress">
      <div class="progress-bar progress-bar-danger progress-bar-striped" id="count_down"  role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" :style="progressRate"> </div>
    </div>
    <br>

    <div class="exam" v-if="exam">
      <h1 v-if="message">{{message}}</h1>
      <table width="100%">
        <tr v-if="resultView"><th>問題</th><th>答え</th><th>結果</th><th>入力</th></tr>
        <tr v-for="exam in exams"> 
          <td class="question">{{ exam.english }}</td>
          <td class="answer" v-if="inputForm">{{ exam.japanese }}</td>
          <td class="answer" v-else>
            <input type="text" v-model="exam.input" :placeholder="exam.english" class="form-control">
          </td>
          <div v-if="resultView">
            <td>{{ exam.result }}</td>
            <td>{{ exam.input }}</td>
          </div>
        </tr>
      </table>
      <!-- <b&#45;table striped :items="exams"></b&#45;table> -->
      <br>
      <button v-on:click="redo" v-if= "redoButton" class="btn btn-success">覚え直す</button>
      <button v-on:click="nextStage" v-if= "nextStageButton" class="btn btn-warning">次の5問に進む</button>
      <button v-on:click="jumpToResult" v-if= "jumpToResultButton" class="btn">回答をチェック</button>
      <button v-on:click="jumpToChackStage" v-if= "jumpToChackStagekButton" class="btn">チェックテストへ進む</button>
    </div>
    <div class="result">
    </div>
  </div>
</template>
<script>

import Vue from 'vue'
import axios from '~/plugins/axios'

export default {
  data :function() {
    return {
      title: '覚えるパート',
      exams: [],
      inputForm: true,
      startButton: false,
      nextButton: false,
      redoButton: false,
      jumpToResultButton: false,
      jumpToChackStagekButton: false,
      exam: false,
      resultView: false,
      message: "",
      progressRate: {width: "100%"},
      wave: 0,
    }
  },
  methods:{
    initialization: function(){
      this.exams = [];
      this.inputForm = true;
      this.startButton = false;
      this.nextStageButton = false;
      this.redoButton = false,
      this.jumpToResultButton = false;
      this.exam = false;
      this.resultView = false;
      this.progressRate = {width: "100%"};
    },
    getExam: function() {
      var self = this
        axios.get(`/learn`).then(function (response) {
          self.exams = response.data
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
    progress: function() {
      var self = this;
      var timer
      var par = 20
        var promise = new Promise(function(resolve, reject){
          timer = window.setInterval(function(){
            var rate = (par -= 2);
            self.progressRate = {width: (rate + '%')};
            if (rate <= 0){
              resolve();
            };
          },1000);
        })
        promise.then(function(){
          clearInterval(timer);
          self.exams = self.arrayShuffle(self.exams);
          self.inputForm = false;
          self.jumpToResultButton = true;
          self.redoButton = true;
        })
    },
    result: function(){
      var self = this;
      self.inputForm = true;
      self.resultView = true;
      self.jumpToResultButton = false;
      self.nextStageButton = true;
    },
    jumpToResult: function(){
      var self = this
        console.log(self.wave)
        for (var i = 0; i < self.exams.length; i++ ) {
          if (self.exams[i].input === self.exams[i].japanese) {
            // 正解
            self.exams[i].result = "o";
            self.exams[i].resultB = true;
          } else {
            //不正解
            self.exams[i].result = "x";
            self.exams[i].resultB = false;
          }
        }
        self.result()
    },
    nextStage: function(){
      var self = this;
      self.resultView = false;
      self.jumpToResultButton = true;
      self.nextStageButton = false;
      var exams = self.mistake();
      if (!(exams[0])) { //間違いがなかった場合
        if (!(self.wave >= 1)){ //ゲームを終了させるか
          self.initialization();
          self.wave++;
          self.message = "Exellent!!";
          self.exam = true;
          self.getExam();
          self.progress();
        } else {
          self.nextButton = false;
          self.message = "Congratulations!!"
            self.jumpToResultButton = false;
          alert("終了！");
          self.initialization();
        }
      } else { //間違いが有った場合
        self.resultView = false;
        self.exams = exams;
        self.inputForm = false;
      }
    },
    redo: function() {
      var self = this;
      self.progress();
      this.inputForm = true;
      this.startButton = false;
      this.nextStageButton = false;
      this.redoButton = false,
      this.jumpToResultButton = false;
      this.resultView = false;
      this.progressRate = {width: "100%"};
      self.exam = true;
    },
    start: function(){
      var self = this;
      self.progress();
      self.initialization();
      self.wave = 0;
      self.startButton = true;
      self.exam = true;
      self.getExam();
    }
  }
}
</script>
