import { LocationApiModel, WeatherApiModel } from '../pages/weather/service/weather.service';

const createWeatherApiModel: (name: string, temp: number) => WeatherApiModel[] = (name: string, temp: number) => {
  return [{ id: Math.random() * Math.random() * 10000, temp, name }];
};

const createLocationApiModel: (name: string) => LocationApiModel = (name: string) => {
  return { name };
};

export const ApiModelGenerators = {
  createWeatherApiModel,
  createLocationApiModel,
};
