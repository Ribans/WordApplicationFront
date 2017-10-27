<template>
  <div>
    <h2>トレーニングパート</h2>

    <p>
    終わりがなく無限に問題を解くことのデキるモードです<br>
    単語を思えるトレーニングに最適なモードです
    </p>

    <select id="select-lang" name="lang" class="btn" v-model="selectedLang">
      <option value="japanese">日本語</option>
      <option value="english">英語</option>
    </select>

    <button id="start" class="btn" v-on:click="start">スタート</button>

    <br> <br>

    <div class="exam">
      <span class="judge">{{ result }}</span>
      <h3 class="exam_title">{{exams[questionLang]}}</h3><br>
      <button class ="btn" v-for=" data in exams.dummies" v-on:click="judgeing(data[answerLang])">{{ data[answerLang] }}</button>
      <ul v-if="examsAnswerShow">
        <li v-for="data in exams.dummies">{{ data[answerLang] }}: {{ data[questionLang] }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from '~/plugins/axios'

var timer

export default {
  data: function() {
    return {
      exams: [], //試験データ
      selectedLang: "japanese", //選択されている言語
      questionLang: "japanese",
      answerLang:   "english",
      result: "", //回答したあとに出す合否
      answerData: [], //回答されたデータ
      examsAnswerShow: false, //正答例データ
      resultShow: false,
    }
  },
  methods: {
    start: function() {
      this.getExam();
      this.switchLang();
      //reset
      this.examsAnswerShow = false,
      this.result = ""
    },
    getExam: function() {
      var vm = this;
      axios.get(`/api/v1/exam/challenge`).then(function(res){
        vm.exams = res.data
      });
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

      new Promise(function(resolve ,reject){
        setTimeout(function() { resolve(); }, 3000);
      }).then(function() {
        vm.examsAnswerShow = true;
        vm.start()
      });
    },
  }
}
</script>
