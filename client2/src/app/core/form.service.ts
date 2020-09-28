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
export class Column {
  /** Column name which is also the property name. */
  name: string;

  /** Type and restrictions for the column's values. */
  domain?: Domain;

  /** Displayed name. */
  label?: string;

  required?: boolean;
  disabled?: boolean;
}

/**
 * Metadata for a field of a read-only form.
 */
export class ViewFormField {
  name: string;
  label: string;
}

export class FormlyFields {
  static date(key: string, label: string, required: boolean = false) {
    return {
      key: key,
      type: 'input',
      templateOptions: {
        placeholder: label,
        required: required,
        type: "date"
      },
    };
  }
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

  /**
   * Converts the column meta data obtained from the server to the FormlyFieldConfigs
   * controlling the dynamic forms.
   */
  formlyFields(cols: Column[], selected?: string[]): FormlyFieldConfig[] {
    return FormService.select(FormService.toFormlyFields(cols), selected, field => field.key as string);
  }

  static select<T>(fields: T[], selected?: string[], key?: (field: T) => string): T[] {
    return selected === undefined
      ? fields
      : fields
        .filter(field => selected.includes(key(field)))
        .sort((f1, f2) => selected.indexOf(key(f1)) - selected.indexOf(key(f2)));
  }

  viewFormFields(cols: Column[], selected?: string[]): ViewFormField[] {
    return FormService.select(FormService.toViewFormFields(cols), selected, field => field.name);
  }

  static toViewFormFields(cols: Column[]): ViewFormField[] {
    return cols.map(FormService.toViewFormField);
  }

  static toViewFormField(col: Column): ViewFormField {
    return {
      name: col.name,
      label: col.label || FormService.capitalizeFirst(col.name),
    };
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
    const required = col.required || false;

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
        field.templateOptions.placeholder = undefined;
        field.className = 'formly-checkbox';
        break;
      case 'datetime':
        field.type = 'datetimepicker';
        break;
      default:
        field.type = 'input';
        field.templateOptions.type = 'text';
        break;
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

