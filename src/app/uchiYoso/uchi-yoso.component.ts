import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
declare var require: any
const wanakana = require('wanakana');
import { HttpClient } from '@angular/common/http';

class UchiYoso {
  english: string;
  uchi: string;
  neutral: string;
  yoso: string;

  constructor(english, uchi, neutral, yoso) {
    this.english = english;
    this.uchi = uchi;
    this.neutral = neutral;
    this.yoso = yoso;
  }
}

class KanjiReading {
    kanji: string;
    hiragana: string;

    constructor(kanji, hiragana)
    {
        this.kanji = kanji;
        this.hiragana = hiragana;
    }
}

@Component({
  selector: 'snjh-uchi-yoso',
  templateUrl: './uchi-yoso.component.html'
})
export class UchiYosoComponent {
  title = 'jisuushi';

  @ViewChild('uchiInputElement') uchiInputElement: ElementRef;

  public uchiInput: string;
  public neutralInput: string;
  public yosoInput: string;

  public uchiYoso: UchiYoso[];
  public kanjiReadings: any;

  public current: UchiYoso;
  public loaded: boolean = false;
  public wrong: boolean = false;

  constructor(private http: HttpClient) {
    this.uchiYoso = [];
    this.kanjiReadings = {};
  }

  ngOnInit() {
    wanakana.bind(document.getElementById('uchi'), { IMEMode: 'ToHiragana' });
    wanakana.bind(document.getElementById('neutral'), { IMEMode: 'ToHiragana' });
    wanakana.bind(document.getElementById('yoso'), { IMEMode: 'ToHiragana' });

    this.http.get('assets/uchiYoso.txt', {responseType: 'text'})
      .subscribe(data => this.parseUchiYoso(data));
    this.http.get('assets/kanjiToHiragana.txt', {responseType: 'text'})
      .subscribe(data => this.parseTranslations(data));
  }

  parseUchiYoso(data) {
    console.log('uchiYoso', data);
    let lines = data.split('\n');
    lines.forEach(element => {
      let line = element.split('、');
      this.uchiYoso.push(new UchiYoso(line[0], line[1], line[2], line[3]));
    });
    this.current = this.uchiYoso[Math.floor(Math.random()*this.uchiYoso.length)];
    this.loaded = true;
    console.log('current', this.current);

  }

  parseTranslations(data) {
      let lines = data.split('\n');
      lines.forEach(element => {
        let line = element.split('、');
        this.kanjiReadings[line[0]] = line[1];
      });
      console.log(this.kanjiReadings);
  }

  check() {
    if (this.checkUchi() && this.checkNeutral() && this.checkYoso()) {
      this.current = this.uchiYoso[Math.floor(Math.random()*this.uchiYoso.length)];
      this.uchiInput = '';
      this.neutralInput = '';
      this.yosoInput = '';
      this.uchiInputElement.nativeElement.focus();
    }
  }

  private checkUchi(): boolean {

    if (!wanakana.isHiragana(this.uchiInput)) {
      //hack to remove bug in wanakana/angular interaction
      this.uchiInput = this.fixHiragana(this.uchiInput);
    }
    let answer = this.current.uchi;

    if (!wanakana.isHiragana(answer))
    {
        answer = this.kanjiReadings[answer];
    }

    if (answer == this.uchiInput) {
      this.wrong = false;
      return true;
    }
    else
    {
      this.wrong = true;
      return false;
    }
  }

  //TODO: refactor
  private checkNeutral() : boolean {
    if (!wanakana.isHiragana(this.neutralInput)) {
      //hack to remove bug in wanakana/angular interaction
      this.neutralInput = this.fixHiragana(this.neutralInput);
    }
    
    let answer = this.current.neutral;

    if (!wanakana.isHiragana(answer))
    {
        answer = this.kanjiReadings[answer];
    }

    if (answer == this.neutralInput) {
      this.wrong = false;
      return true;
    }
    else
    {
      this.wrong = true;
      return false;
    }
  }

  //TODO: refactor
  private checkYoso() : boolean {

    if (!wanakana.isHiragana(this.yosoInput)) {
      //hack to remove bug in wanakana/angular interaction
      this.yosoInput = this.fixHiragana(this.yosoInput);
    }
    
    let answer = this.current.yoso;

    if (!wanakana.isHiragana(answer))
    {
        answer = this.kanjiReadings[answer];
    }

    if (answer == this.yosoInput) {
      this.wrong = false;
      return true;
    }
    else
    {
      this.wrong = true;
      return false;
    }
  }

  private fixHiragana(input: string) : string {
    if (input.length >= 2 && input[input.length - 1] === 'n' && input[input.length - 2] === 'n') {
      input = input.substr(0, input.length - 1); 
    }

    return wanakana.toHiragana(input);
  }

}
