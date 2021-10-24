import * as fs from 'fs/promises';
import nunjucks from 'nunjucks';
import {putIfAbsentAsync} from '../common/util';

/**
 * Interface for template-based renderer for objects of type `T`.
 */
export interface TemplateRenderer<T extends object> {
  /**
   * Renders the `data` using the template with the given `templateName`.
   */
  render(templateName: string, data: T): Promise<string>;
}

const nunjucksEnv = nunjucks.configure({});

nunjucksEnv.addFilter('fixed', (num, length) => num.toFixed(length || 2));

nunjucksEnv.addFilter('date', (value: Date|string) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString();
});

/**
 * Cache for the compiled nunjucks templates.
 */
class NunjucksTemplateRepository {
  private readonly templates = new Map<string, nunjucks.Template>();

  constructor(private readonly templateDir: string) {}

  /**
   * Returns the compiled nunjucks template with the given `templateName`.
   */
  async getTemplate(templateName: string): Promise<nunjucks.Template> {
    return putIfAbsentAsync(
        this.templates, templateName, async key => this.createTemplate(key));
  }

  /**
   * Gets or creates all the specified template.
   *
   * This method can be used to load and compile the templates ahead of time so
   * that errors are recognized early.
   */
  getTemplates(templateNames: string[]): Promise<nunjucks.Template[]> {
    return Promise.all(
        templateNames.map(templateName => this.getTemplate(templateName)));
  }

  private async createTemplate(templateName: string):
      Promise<nunjucks.Template> {
    const contents = await this.readTemplateFile(templateName);
    return nunjucks.compile(contents, nunjucksEnv);
  }

  private async readTemplateFile(templateName: string): Promise<string> {
    const filename = `${this.templateDir}/${templateName}`;
    const contents = await fs.readFile(filename, {encoding: 'utf-8'});
    return contents;
  }
}

export class NunjucksTemplateRenderer<T extends object> implements
    TemplateRenderer<T> {
  constructor(private readonly templateRepository: NunjucksTemplateRepository) {
  }

  async render(templateName: string, data: T): Promise<string> {
    const template = await this.templateRepository.getTemplate(templateName);
    try {
      return template.render(data);
    } catch (e) {
      console.log(
          `nunjucks error rendering ${templateName}`, e,
          JSON.stringify(data, undefined, 2));
      throw e;
    }
  }
}

export function createTemplateRenderer<T extends object>(templateDir: string):
    TemplateRenderer<T> {
  return new NunjucksTemplateRenderer<T>(
      new NunjucksTemplateRepository(templateDir));
}