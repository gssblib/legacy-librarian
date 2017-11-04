
import { Injectable } from "@angular/core";
import { FormlyFieldConfig } from "@ngx-formly/core";

class Domain {
  type: string;
  validation?: any;
  options?: Array<string>;
}

/**
 * Column metadata as returned by the server.
 */
class Column {
  name: string;
  domain?: Domain;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Support service for forms.
 *
 * Most forms are constructed on the fly from metadata obtained from the server.
 * These forms are rendered using the formly library. This service takes care of
 * the conversions from the metadata to the formly field configurations.
 */
@Injectable()
export class FormService {

  formlyFields(cols: Array<Column>): Array<FormlyFieldConfig> {
    return FormService.toFormlyFields(cols);
  }

  /**
   * Returns the standard formly option for a value that's also used as the label.
   */
  static toFormlyOption(value: string) {
    return {label: value, value: value};
  }

  /**
   * Converts a list of value strings to a list for formly options.
   */
  static toFormlyOptions(values: Array<string>): Array<{label:string, value: string}> {
    return values.map(FormService.toFormlyOption);
  }

  static toFormlyFields(cols: Array<Column>): Array<FormlyFieldConfig> {
    return cols.map(FormService.toFormlyField);
  }

  static toFormlyField(col: Column): FormlyFieldConfig {
    const domain: Domain = col.domain || {type: 'string'};
    const title = col.label || FormService.capitalizeFirst(col.name);
    const required = col.required;

    const field: FormlyFieldConfig = {
      key: col.name,
      templateOptions: {
        label: title,
        placeholder: title,
        required: required,
      }
    };
    switch (domain.type) {
      case 'enum':
        field.type = 'select';
        field.templateOptions.options = FormService.toFormlyOptions(domain.options);
        break;
      case 'boolean':
        field.type = 'checkbox';
        break;
      default:
        field.type = 'input';
        field.templateOptions.type = 'text';
    }
    if (domain.validation) {
      field.templateOptions.minLength = domain.validation.minLength;
      field.templateOptions.maxLength = domain.validation.maxLength;
    }
    if (col.disabled) {
      field.templateOptions.disabled = true;
    }
    return field;
  }

  static capitalizeFirst(s) {
    return s.charAt(0).toUpperCase() + s.substr(1);
  }
}

