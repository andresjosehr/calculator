import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  @ViewChild('display') display!: ElementRef;
  @ViewChild('displayValue') displayValue!: ElementRef;
  @ViewChild('displayValueInner') displayValueInner!: ElementRef;

  currentValue = '0';
  operation: '+' | '-' | '*' | '/' | '=' | null = null;
  prevValue = '0';
  prevDisplay: string = '';

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.key === 'Enter') {
      this.calculate();
    }
    if(event.key === 'Backspace') {
      this.deleteKey();
    }

    if(event.key.match(/^[0-9]$/)) {
      this.pickNumber(event.key);
    }

    if(event.key.match(/^[+\-*/=]$/)) {
      this.pickOperator(event.key as '+' | '-' | '*' | '/' | '=');
    }

    if(event.key === '.') {
      this.pickDecimal();
    }


  }

  constructor() { }

  ngOnInit(): void {
  }

  pickNumber(value: string) {
    if(this.currentValue.length <= 10) {
      this.currentValue = this.currentValue==='0' ? value : this.currentValue + value;
    }
  }

  deleteKey() {
    if(this.currentValue.length > 1) {
      this.currentValue = this.currentValue.substring(0, this.currentValue.length - 1);
    } else {
      this.currentValue = '0';
    }
  }

  pickOperator(operator: '+' | '-' | '*' | '/' | '=') {
    this.calculateWithOperator();
    this.prevValue = this.currentValue;
    this.prevDisplay = this.currentValue + operator;
    this.currentValue = '0';
    this.operation = operator;
  }

  calculateWithOperator() {
    if(this.operation === '+') {
      this.currentValue = (parseFloat(this.prevValue) + parseFloat(this.currentValue)).toString();
    } else if(this.operation === '-') {
      this.currentValue = (parseFloat(this.prevValue) - parseFloat(this.currentValue)).toString();
    } else if(this.operation === '*') {
      this.currentValue = (parseFloat(this.prevValue) * parseFloat(this.currentValue)).toString();
    } else if(this.operation === '/') {
      this.currentValue = (parseFloat(this.prevValue) / parseFloat(this.currentValue)).toString();
    }
    this.currentValue = this.roundToExponentialFunctionBaseE(this.currentValue);
  }

  calculate() {
    if(this.operation === null) {
      this.prevDisplay = this.currentValue+'=';
      return ;
    }
    this.prevDisplay = this.prevValue + this.operation + this.currentValue + '=';

    if(this.operation === '+') {
      this.currentValue = (parseFloat(this.prevValue) + parseFloat(this.currentValue)).toString();
    } else if(this.operation === '-') {
      this.currentValue = (parseFloat(this.prevValue) - parseFloat(this.currentValue)).toString();
    } else if(this.operation === '*') {
      this.currentValue = (parseFloat(this.prevValue) * parseFloat(this.currentValue)).toString();
    } else if(this.operation === '/') {
      this.currentValue = (parseFloat(this.prevValue) / parseFloat(this.currentValue)).toString();
    }
    this.currentValue = this.roundToExponentialFunctionBaseE(this.currentValue);

    this.prevValue = this.currentValue;


    this.operation = null;
  }

  pickDecimal() {
    this.currentValue = this.currentValue + '.';
  }

  reset() {
    this.currentValue = '0';
    this.prevValue = '0';
    this.operation = null;
    this.prevDisplay = '';
  }

  roundToExponentialFunctionBaseE(value: string): string {

    if(value.length < 10) {
      return value;
    }
    const number = parseFloat(value);
    if(number === 0) {
      return '0';
    }
    const exponent = Math.floor(Math.log10(number));
    const mantissa = number / Math.pow(10, exponent);
    const roundedMantissa = Math.round(mantissa * 100) / 100;
    return roundedMantissa.toString() + 'e' + exponent.toString();

  }

}
