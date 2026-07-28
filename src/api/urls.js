import config from "../config/config";

const { BASE_URL } = config;

export const blog_url = BASE_URL + "/api/express-earth/blog/";

export const blog_detail_url = (slug) => blog_url + `${slug}/`;

export const create_blog_url = blog_url + "create/";

export const update_blog_url = (blogId) => blog_url + `${blogId}/update/`;

export const delete_blog_url = (blogId) => blog_url + `${blogId}/delete/`;

export const case_study_url = BASE_URL + "/api/express-earth/case-study/";

export const case_study_detail_url = (slug) => case_study_url + `${slug}/`;

export const create_case_study_url = case_study_url + "create/";

export const update_case_study_url = (caseStudyId) =>
  case_study_url + `${caseStudyId}/update/`;

export const delete_case_study_url = (caseStudyId) =>
  case_study_url + `${caseStudyId}/delete/`;
