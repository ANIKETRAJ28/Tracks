import { IElement, IElementRequest } from '@repo/types';

import { ElementRepository } from '../repository/element.repository';

export class ElementService {
  private elementRepository: ElementRepository;

  constructor() {
    this.elementRepository = new ElementRepository();
  }

  async createElement(reqObj: IElementRequest): Promise<IElement> {
    return await this.elementRepository.createElement(reqObj);
  }

  async getElementById(id: string): Promise<IElement> {
    return await this.elementRepository.getElementById(id);
  }

  async updateElementContent(id: string, content: string): Promise<IElement> {
    return await this.elementRepository.updateElementContent(id, content);
  }
}
