import { expect } from 'chai';
import App from '../src/js/app';

const app = new App();

describe('calculatePercentage', () => {
  it('should calculate percentage between two give numbers', () => {
    const percentage = app.calculatePercentage(20, 200);
    expect(percentage).to.equal(10);
  });
});

describe('setData', () => {
  it('should set the application data correctly', () => {
    const dataObject = { buttons: [10, 29, -12, -10], bars: [26, 27, 19, 11], limit: 160 };
    app.setData(dataObject);
    const newData = app.getData();
    expect(newData).to.equal(dataObject);
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
