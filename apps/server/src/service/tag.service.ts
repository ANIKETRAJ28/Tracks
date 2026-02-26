import { ITag, ITagRequest } from '@repo/types';

import { TagRepository } from '../repository/tag.repository';

export class TagService {
  private tagRepository: TagRepository;

  constructor() {
    this.tagRepository = new TagRepository();
  }

  async createTag(data: ITagRequest): Promise<ITag> {
    return await this.tagRepository.createTag(data.name, data.metadata);
  }

  async getTagById(id: string): Promise<ITag> {
    return await this.tagRepository.getTagById(id);
  }

  async getTagByName(name: string): Promise<ITag> {
    return await this.tagRepository.getTagByName(name);
  }

  async getTags(): Promise<ITag[]> {
    return await this.tagRepository.getTags();
  }

  async updateTagName(id: string, name: string): Promise<ITag> {
    return await this.tagRepository.updateTagName(id, name);
  }

  async deleteTagById(id: string): Promise<void> {
    return await this.tagRepository.deleteTagById(id);
  }
}
