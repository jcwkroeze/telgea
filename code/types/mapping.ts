/**
 * Type definitions for the configurable mapping system
 */

export type TransformFunction = 'parseFloat' | 'parseInt' | 'toUpperCase' | 'toLowerCase' | 'toString';

export interface FieldTransformation {
  target: string;
  transform?: TransformFunction;
}

export type FieldMapping = string | FieldTransformation;

export interface MappingConfig {
  [sourceType: string]: {
    [sourcePath: string]: FieldMapping;
  };
}

export interface MapperInterface {
  map<T>(source: any, mappingKey: string): T;
}