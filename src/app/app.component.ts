import { Component, OnInit } from '@angular/core';
declare var require: any
const wanakana = require('wanakana');
import { HttpClient } from '@angular/common/http';


class Jisuushi {
  type: string;
  engCounter: string;
  counter: string;
  hiragana: string;

  constructor(type: string, engCounter: string, counter: string, hiragana: string) {
    this.type = type;
    this.engCounter = engCounter;
    this.counter = counter;
    this.hiragana = hiragana;
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'jisuushi';
  public input: string;

  public jisuushi: Jisuushi[];
  public current: Jisuushi;
  public loaded: boolean = false;
  public wrong: boolean = false;

  constructor(private http: HttpClient) {
    this.jisuushi = [];
  }

  ngOnInit() {
    var textInput = document.getElementById('form7');
    wanakana.bind(textInput, { IMEMode: 'ToHiragana' });
    this.http.get('assets/data.txt', {responseType: 'text'})
        .subscribe(data => this.parseData(data));
  }

  parseData(data) {
    let lines = data.split('\n');
    lines.forEach(element => {
      let line = element.split(' ');
      this.jisuushi.push(new Jisuushi(line[0], line[1], line[2], line[3]));
    });
    this.current = this.jisuushi[Math.floor(Math.random()*this.jisuushi.length)];
    this.loaded = true;
  }

  check() {

    if (!wanakana.isHiragana(this.input)) {

      //hack to remove bug in wanakana/angular interaction
      if (this.input.length >= 2 && this.input[this.input.length - 1] === 'n' && this.input[this.input.length - 2] === 'n') {
        this.input = this.input.substr(0, this.input.length - 1); 
      }

      this.input = wanakana.toHiragana(this.input);
    }
    
    if (this.current.hiragana == this.input) {
      this.wrong = false;
      this.current = this.jisuushi[Math.floor(Math.random()*this.jisuushi.length)];
      console.log(this.current);
      this.input = '';
    }
    else
    {
      this.wrong = true;
    }

  }


}
