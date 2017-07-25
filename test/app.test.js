import { expect } from 'chai';
import jsdom from 'jsdom';
import App from '../src/js/app';

const { JSDOM } = jsdom;
const dom = new JSDOM('<!DOCTYPE html><body><div class="bars"></div><div class="buttons"></div><span class="error-message"></span></body></html>');
const { window } = dom;
const { document } = window;
global.document = document;
global.window = window;

const app = new App();

describe('setData', () => {
  it('should set the application data correctly', () => {
    const dataObject = { buttons: [10, -29], bars: [26], limit: 160 };
    app.setData(dataObject);
    const newData = app.getData();
    expect(newData).to.equal(dataObject);
  });
});

describe('calculatePercentage', () => {
  it('should calculate percentage between two give numbers', () => {
    const percentage = app.calculatePercentage(20, 200);
    expect(percentage).to.equal(10);
  });
});

describe('calculateNewValues', () => {
  it('given a negative number it should return the correct values', () => {
    const newValues = app.calculateNewValues(10, -20);
    expect(newValues).to.eql({ percentage: 0, newValue: 0 });
  });

  it('given a positive number it should return the correct values', () => {
    const newValues = app.calculateNewValues(10, 20);
    expect(newValues).to.eql({ percentage: 19, newValue: 30 });
  });
});

describe('generateBars', () => {
  it('should generate bars based on the data retrieved from API', () => {
    app.generateBars();
    const element = document.querySelector('.bars .progress');
    expect(element).to.not.be.null; // eslint-disable-line no-unused-expressions
  });
});

describe('errorMessage', () => {
  it('should display a given error message', () => {
    const error = 'Error message';
    app.errorMessage(error);
    const result = document.querySelector('.error-message').innerHTML;
    expect(result).to.equal(error);
  });
  it('should clear the error message html', () => {
    app.errorMessage();
    const result = document.querySelector('.error-message').innerHTML;
    expect(result).to.equal('');
  });
});

describe('updateApplicationState', () => {
  it('should update the application state object by key', () => {
    app.updateApplicationState(0, 10);
    const newData = app.getData();
    expect(newData.bars[0]).to.equal(10);
    // reset to default
    app.updateApplicationState(0, 26);
  });
});

describe('styleProgressBar', () => {
  it('should add an alert class and a max width of 100% when percentage is over 100%', () => {
    app.styleProgressBar(0, { percentage: 110 });
    const hasClassAlert = document.querySelector('.bars .progress[data-index="0"]').classList.contains('alert');
    const width = document.querySelector('.bars .progress[data-index="0"] .progress-meter').style.width;
    expect(hasClassAlert).to.be.true; // eslint-disable-line no-unused-expressions
    expect(width).to.equal('100%');
  });
  it('should remove alert class when percentage is below 100%', () => {
    app.styleProgressBar(0, { percentage: 99 });
    const hasClassAlert = document.querySelector('.bars .progress[data-index="0"]').classList.contains('alert');
    expect(hasClassAlert).to.be.false; // eslint-disable-line no-unused-expressions
  });
});

describe('generateButtons', () => {
  it('should generate correct buttons based on the API data', () => {
    app.generateButtons();
    const elements = document.querySelectorAll('.buttons .button');
    elements.forEach((element) => {
      expect(element).to.not.be.null; // eslint-disable-line no-unused-expressions
    });
  });
  it('should add class .success to button with positive number', () => {
    const elements = document.querySelectorAll('.buttons .button');
    elements.forEach((element) => {
      const number = parseInt(element.innerHTML, 10);
      const hasClassSuccess = element.classList.contains('success');
      if (number > 0) {
        expect(hasClassSuccess).to.be.true; // eslint-disable-line no-unused-expressions
      }
    });
  });
  it('should add class .alert to button with positive number', () => {
    const elements = document.querySelectorAll('.buttons .button');
    elements.forEach((element) => {
      const number = parseInt(element.innerHTML, 10);
      const hasClassAlert = element.classList.contains('alert');
      if (number <= 0) {
        expect(hasClassAlert).to.be.true; // eslint-disable-line no-unused-expressions
      }
    });
  });
});

describe('getCheckedRadio', () => {
  it('should return null if no radio buttons are checked', () => {
    expect(app.getCheckedRadio()).to.be.null; // eslint-disable-line no-unused-expressions
  });
  it('should return an element if a radio is checked', () => {
    document.querySelectorAll('input[type="radio"]')[0].checked = true;
    expect(app.getCheckedRadio()).to.not.be.null; // eslint-disable-line no-unused-expressions
  });
});

describe('onButtonClick', () => {
  it('should add and remove the value of the clicked button', () => {
    document.querySelectorAll('.buttons .button')[0].dispatchEvent(new window.Event('click'));
    const newValue = parseInt(document.querySelector('.bars .progress[data-index="0"] span.value').innerHTML, 10);
    expect(newValue).to.equal(36);
  });
});
