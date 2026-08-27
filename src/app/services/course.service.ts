import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";

import {
  Course,
  CourseDetail,
  PagedResponse
} from "../models/course.model";

@Injectable({
  providedIn: "root",
})
export class CourseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/courses`;

  getAll(page = 1, pageSize = 50) {
    return this.http
      .get<PagedResponse<Course>>(this.baseUrl, {
        params: {
          page: page.toString(),
          pageSize: pageSize.toString(),
        },
      })
      .pipe(map((p) => p.items));
  }

  getById(id: string) {
    return this.http.get<CourseDetail>(`${this.baseUrl}/${id}`);
  }
  delete(id: number) {
  return this.http.delete<void>(`${this.baseUrl}/${id}`);
}
}