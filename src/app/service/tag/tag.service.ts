
import { tag } from "src/app/api/tag/tag.api";
import { TagModel } from "src/app/model/tag.model";

const insert = async (formData:TagModel) => {
  const data = await tag.insert(formData); 
  return data; 
}

const remove = async (name: string, tags: { [category: string]: TagModel[] }) => {
  try {
    await tag.remove(name);

    const updatedTags: { [category: string]: TagModel[] } = Object.entries(tags).reduce(
      (acc, [category, tagList]) => {
        acc[category] = Array.isArray(tagList) ? tagList.filter((tag) => tag.name !== name) : [];
        return acc;
      },
      {} as { [category: string]: TagModel[] }
    );

    return updatedTags;
  } catch (error) {
    console.error("태그 삭제 중 문제가 발생했습니다:", error);
    return null;
  }
};

const fetchTag = async (): Promise<{ [category: string]: TagModel[] }> => {
  try {
    const tags = await tag.getByCategories();

    if (!tags || Object.keys(tags).length === 0) { // 데이터를 배열로 변환
      console.error("태그 데이터가 비어 있습니다.");
      return {};
    }

    const categorizedTags: { [category: string]: TagModel[] } = {};
    Object.entries(tags).forEach(([category, tagList]) => {
      if (Array.isArray(tagList)) {
        categorizedTags[category] = tagList;
      }
    });
    return categorizedTags;
  } catch (error) {
    console.error("Error in fetchTagsData:", error);
    throw error;
  }
};

export const tagService = {insert, remove, fetchTag};
