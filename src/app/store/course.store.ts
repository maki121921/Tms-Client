import { inject } from '@angular/core';

import {
  signalStore,
  withMethods,
  withState,
  patchState
} from '@ngrx/signals';

import {
  withEntities,
  removeEntity,
  setAllEntities
} from '@ngrx/signals/entities';

import {
  catchError,
  EMPTY
} from 'rxjs';

import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';

export const CourseStore = signalStore(
  { providedIn: 'root' },

  withState({
    error: null as string | null
  }),

  withEntities<Course>(),

  withMethods((store, svc = inject(CourseService)) => ({

    deleteCourse(id: number) {

      // 1. Take snapshot of current entities BEFORE mutating
      const previousSnapshot = store.entities();

      // 2. Instant visual feedback
      patchState(
        store,
        removeEntity(id)
      );

      // 3. Dispatch API call
      svc.delete(id).pipe(

        catchError(err => {

          // 4. Server rejected request
          // Restore previous snapshot
          patchState(
            store,
            setAllEntities(previousSnapshot)
          );

          // Set error message
          patchState(store, {
            error:
              'Cannot delete course: active student enrollments exist.'
          });

          return EMPTY;
        })

      ).subscribe();
    }

  }))
);