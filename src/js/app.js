import axios from 'axios';

class App {
  constructor() {
    this.data = null;
  }

  setData(data) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  init() {
    const request = axios.get('http://pb-api.herokuapp.com/bars');
    request.then((response) => {
      this.setData(response.data);
      console.log(this.data); // eslint-disable-line no-console
      this.generateBars();
      this.generateButtons();
    });
    request.catch((error) => {
      console.log(error); // eslint-disable-line no-console
    });
  }

  calculatePercentage(bar, limit) {
    return Math.round((bar / limit) * 100);
  }

  generateBars() {
    const { bars } = this.data;
    bars.forEach((bar, i) => {
      const percentage = this.calculatePercentage(bar, this.data.limit);
      document.querySelector('.bars').insertAdjacentHTML('beforeend',
        `<div class="row">
          <div class="small-1 columns">
            <input type="radio" name="radio" data-index="${i}">
          </div>
          <div class="columns">
            <div data-index="${i}" class="progress" role="progressbar" tabindex="0">
              <span class="progress-meter" style="width: ${percentage}%">
                <p class="progress-meter-text"><span class="value">${bar}</span> (<span class="percentage">${percentage}%</span> of ${this.data.limit})</p>
              </span>
            </div>
          </div>
        </div>`
      );
    });
  }

  errorMessage(error = '') {
    document.querySelector('.error-message').innerHTML = error;
  }

  updateApplicationState(index, newValue) {
    const data = this.getData();
    data.bars[index] = newValue;
    this.setData(data);
  }

  calculateNewValues(value, currentValue) {
    const newValue = parseInt(currentValue, 10) + parseInt(value, 10);
    if (newValue <= 0) {
      return { percentage: 0, newValue: 0 };
    }
    const percentage = this.calculatePercentage(newValue, this.data.limit);
    return { percentage, newValue };
  }

  styleProgressBar(index, newValues) {
    if (newValues.percentage <= 100) {
      document.querySelector(`.bars .progress[data-index="${index}"]`).classList.remove('alert');
      document.querySelector(`.bars .progress[data-index="${index}"] .progress-meter`).style.width = `${newValues.percentage}%`;
    } else {
      document.querySelector(`.bars .progress[data-index="${index}"]`).classList.add('alert');
      document.querySelector(`.bars .progress[data-index="${index}"] .progress-meter`).style.width = '100%';
    }
  }

  onButtonClick(event) {
    const value = parseInt(event.target.getAttribute('data-value'), 10);
    let checked = 0;
    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      if (radio.checked) {
        checked += 1;
        this.errorMessage();

        const index = radio.getAttribute('data-index');
        const valueElement = document.querySelector(`.bars .progress[data-index="${index}"] span.value`);
        const newValues = this.calculateNewValues(value, valueElement.innerHTML);

        this.updateApplicationState(index, newValues.newValue);
        console.log(this.data); // eslint-disable-line no-console

        valueElement.innerHTML = newValues.newValue;
        this.styleProgressBar(index, newValues);
        document.querySelector(`.bars .progress[data-index="${index}"] span.percentage`).innerHTML = `${newValues.percentage}%`;
      }
    });
    if (!checked) this.errorMessage('Please select a progress bar by checking a radio input');
  }

  generateButtons() {
    const { buttons } = this.data;
    buttons.forEach((button) => {
      const addedClass = button > 0 ? 'success' : 'alert';
      document.querySelector('.buttons').insertAdjacentHTML('beforeend',
        `<a class="${addedClass} button" data-value="${button}">${button}</a>`
      );
    });
    document.querySelectorAll('a.button').forEach((button) => {
      button.addEventListener('click', event => this.onButtonClick(event));
    });
  }
}

new App().init();
export default App;
