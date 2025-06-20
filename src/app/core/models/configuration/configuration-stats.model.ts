import { Component } from "../component/component.model";

export interface ConfigurationStats {
    totalConfigurations: number;
    averageComponentsPerConfig: number;
    mostPopularComponent?: Component;
}