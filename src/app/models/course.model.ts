/**
 * List row from the TMS API
 */
export interface Course {
  id: number;
  code: string;
  title: string;
  maxCapacity: number;
  enrollmentCount: number;
}


/**
 * Envelope for GET /api/courses
 */
export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}


/**
 * Course detail link
 */
export interface CourseLink {
  href: string;
  rel: string;
  method: string;
}


/**
 * Course detail payload
 */
export interface CourseDetail extends Course {
  links: readonly CourseLink[];
}