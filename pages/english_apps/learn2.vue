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
      残り: {{ remainingTimeValue.width }}
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
      <b-table striped hover :items="exams"></b-table>
      <button v-on:click="button(redoAction)" v-if= "redoText" class="btn btn-success">{{ redoText }}</button>
      <button v-on:click="button(nextAction)" v-if= "nextText" class="btn btn-warning" :disabled=" redoAction === '4' ">{{ nextText }}</button>
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
      this.wave++;
      new Promise((resolve, reject) => {
        this.getExam( exams => {
          resolve(exams);
        });
      }).then( exams => {
        // this.originExams = Object.assign([], exams);
        this.originExams = JSON.parse(JSON.stringify(exams));
        this.examWindowSetup(exams);
        this.countDown(20, () => {
          this.inputWindowSetup(exams);
        });
      });
    },
    button (switchCase) {
      switch (switchCase) {
        case "1": //覚え直す
        this.examWindowSetup(this.originExams);
        this.countDown(20, () => {
          this.inputWindowSetup(this.originExams);
        });
        break
        case "2": //採点
        this.resultWindowSetup(this.exams);
        break
        case "3": // 次の問題
        console.log(switchCase);
        break;
        case "4": //やり直す
        console.log(switchCase);
        this.examWindowSetup(
          this.exams.filter( element => {
            console.log(element.done)
            return element.done === false
          })
        ); //間違えたものだけ表示
        this.countDown(20, () => {
          this.inputWindowSetup(this.originExams);
        });
        break;
      }
    },
    init () {
    },
    examWindowSetup (exams) {
      this.examWindow = true; this.inputWindow = false; this.resultWindow = false;
      this.exams = JSON.parse(JSON.stringify(exams))
    },
    inputWindowSetup (exams) {
      const examsC = JSON.parse(JSON.stringify(exams));
      this.exams = this.arrayShuffle(examsC);
      this.examWindow = false; this.inputWindow = true; this.resultWindow = false;
      this.redoAction = "1"; this.nextAction = "2"
      this.redoText = "覚え直す";
      this.nextText = "採点";
    },
    resultWindowSetup (exams) {
      this.examWindow = false; this.inputWindow = false; this.resultWindow = true;
      this.exams = this.scoring(exams);
      let miss = this.exams.find( value => {
        if ( value.result === "不正解" ) { return true };
      });
      this.nextText = "次へ";
      if (miss) {
        this.redoText = "やり直す";
        this.redoAction = "4"; this.nextAction = "3"
      } else {
        this.redoAction = "1"; this.nextAction = "3"
      }
    },
    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ private
    getExam (ret) {
      axios.get(`/learn`).then( response => {
        ret(response.data)
      }).catch( error => {
        console.log(error);
      });
    },
    arrayShuffle (array) {
      for(let i = array.length - 1; i > 0; i--){
        const r = Math.floor(Math.random() * (i + 1));
        const tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
      }
      return array
    },
    scoring (exams) {
      for( let i = 0; i < exams.length; i++ ) {
        if (exams[i].input === exams[i].japanese) {
          exams[i].result = "正解";
          exams[i].done = true;
        } else {
          exams[i].result = "不正解";
          exams[i].done = false;
        };
      };
      return exams;
    },
    countDown (par, ret) {
      let timer;
      const promise = new Promise((resolve, reject) => {
        timer = window.setInterval(() => {
          const rate = (par -= 2);
          this.remainingTimeValue = {width: (rate + '%')};
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
