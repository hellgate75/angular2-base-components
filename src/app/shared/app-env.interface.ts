/**
 * Define your app env interface here
 * Only valid JSON data types are allowed
 */
export interface Service {
  name: string;
  uri: string;
  methods: string[];
}
export interface ServiceServer {
  protocol: string;
  host: string;
  port: number;
  services: Service[];
}
export interface Environment {
  production: boolean;
}
export interface AppEnv {
  services: ServiceServer;
  environment: Environment;
}
