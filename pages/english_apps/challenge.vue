<template>
  <div>
    <h2>チャレンジパート</h2>

    <b-alert variant="danger" dismissible :show="!!errorMessage[0]">
      {{ errorMessage }}
    </b-alert>

    <select id="select-lang" name="lang" class="btn" v-model="selectedLang">
      <option value="japanese">日本語</option>
      <option value="english">英語</option>
    </select>

    <button id="start" class="btn" v-on:click="start">スタート</button>

    <br> <br>

    <div class="progress">
      <div class="progress-bar progress-bar-danger progress-bar-striped" id="count_down"  role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" :style="progress"> </div>
    </div>
    <br>

    <div class="exam">
      <span class="judge">
        {{ result }}
      </span>
      <br>
      <strong><span id="count" >残り問題数: {{ 11 - wave }} </span></strong><br>
      <h3 class="exam_title">{{exams[questionLang]}}</h3><br>
      <button class="btn" v-for=" data in exams.dummies" v-on:click="judgeing(data[answerLang])">{{ data[answerLang] }}</button>
      <ul v-if="examsAnswerShow">
        <li v-for="data in exams.dummies">{{ data[answerLang] }}: {{ data[questionLang] }}</li>
      </ul>
    </div>

    <div class="result" v-if="resultShow">
      <table>
        <th>ID</td><th>問題</th><th>ボタン1</th> <th>ボタン2</th> <th>ボタン3</th> <th>ボタン4</th> <th>回答</th>
        <tr v-for="(data, index) in answerData">
          <td> {{index+1}} </td>
          <td> {{data.exams[answerLang] }} </td>
          <td v-for="dummies in data.exams.dummies"> {{ dummies[answerLang] }}({{ dummies[questionLang] }})</td>
          <td> {{data.selectAnswer }}({{data.result}})</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from '~/plugins/axios'

var timer

export default {
  data: function() {
    return {
      errorMessage: "",
      exams: [], //試験データ
      selectedLang: "japanese", //選択されている言語
      questionLang: "japanese",
      answerLang:   "english",
      result: "", //回答したあとに出す合否
      answerData: [], //回答されたデータ
      examsAnswerShow: false, //正答例データ
      resultShow: false,
      wave: 1, //何問解いたかカウント
      progress: {width: "100%"},
    }
  },
  methods: {
    start: function() {
      if (this.$store.state.currentUser && !(this.$store.state.currentUser.statusCode == 403)) {  
        this.getExam( done => {
          if (done) {
            this.switchLang();
            this.timer();
            //reset
            this.examsAnswerShow = false,
            this.result = ""
          }
        });
      } else {
        this.errorMessage = "ログインしてください"
      }
    },
    getExam: function(done) {
      axios.post(`/challenge`, JSON.stringify({
        uid: this.$store.state.currentUser.profile.uid
      })).then((res) => {
        this.exams = res.data;
        done(true);
      }).catch( e => {
        this.errorMessage = e.response.data.message;
        done(false);
      });
    },
    timer: function() {
      var par = 100;
      var vm = this;
      timer = setInterval(function(){
        if (par >= 0){
          vm.progress = {width: ((par -= 10) + '%')}
        } else {
          vm.judgeing("Timeout")
        }
      }, 1000)
    },
    switchLang: function() {
      var vm = this;
      switch (vm.selectedLang) {
        case "japanese":
          console.log("Selected: Japanese");
          vm.questionLang = "english";
          vm.answerLang = "japanese";
          break;
        case "english":
          console.log("Selected: English");
          vm.questionLang = "japanese";
          vm.answerLang = "english";
          break;
      }
    },
    judgeing: function(value) {
      var vm = this;
      if (vm.exams[vm.answerLang] === value){
        console.log("正解");
        vm.answerData.push({exams: vm.exams, result: "OK", selectAnswer: value})
        vm.result = "正解"
      } else {
        console.log("不正解");
        vm.answerData.push({exams: vm.exams, result: "NO", selectAnswer: value})
        vm.result = "不正解"
      }
      vm.next();
    },
    next: function() {
      var vm = this;
      clearInterval(timer);

      new Promise(function(resolve ,reject){
        vm.examsAnswerShow = true;
        setTimeout(function() { 
          resolve(); 
        }, 3000);
      }).then(function() {
        if ( vm.wave < 10 ) {
          vm.wave += 1;
          vm.start()
        } else {
          vm.resultShow = true;
          vm.exams = [];
          vm.examsAnswerShow = false;
          alert("終了！")
          return false;
        }
      });
    },
  }
}
</script>
