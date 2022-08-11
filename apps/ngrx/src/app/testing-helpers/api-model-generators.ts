import { LocationApiModel, WeatherApiModel } from '../pages/weather/service/weather.service';

// TODO extract me into a lib
const createWeatherApiModel: (name: string, temp: number) => WeatherApiModel[] = (name: string, temp: number) => {
  return [{ id: Math.random() * Math.random() * 10000, temp, name }];
};

// TODO extract me into a lib
const createLocationApiModel: (name: string) => LocationApiModel = (name: string) => {
  return { name };
};

// TODO extract me into a lib
export const ApiModelGenerators = {
  createWeatherApiModel,
  createLocationApiModel,
};
