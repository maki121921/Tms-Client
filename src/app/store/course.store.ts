import { inject } from '@angular/core';

import {
  signalStore,
  withMethods,
  withState,
  patchState
} from '@ngrx/signals';

import {
  withEntities,
  setAllEntities,
  removeEntity
} from '@ngrx/signals/entities';

import {
  catchError,
  EMPTY,
  tap
} from 'rxjs';

import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';

export const CourseStore = signalStore(
  { providedIn: 'root' },

  withState({
    isLoading: false,
    error: null as string | null
  }),

  withEntities<Course>(),

  withMethods((
    store,
    svc = inject(CourseService)
  ) => ({

    loadCourses() {
      patchState(store, {
        isLoading: true,
        error: null
      });

      svc.getAll().pipe(

        tap(courses => {
          patchState(
            store,
            setAllEntities(courses),
            {
              isLoading: false
            }
          );
        }),

        catchError(err => {
          patchState(store, {
            isLoading: false,
            error: err.error?.detail ??
              'Unable to load courses.'
          });

          return EMPTY;
        })
      ).subscribe();
    },

    deleteCourse(id: number) {

      // 1. IMPORTANT: snapshot BEFORE modifying the store
      const previousSnapshot = store.entities();

      // 2. Remove immediately from UI
      patchState(
        store,
        removeEntity(id)
      );

      // 3. Tell the backend
      svc.delete(id).pipe(

        tap(() => {
          // Delete succeeded.
          // Nothing else is necessary because
          // the entity was already removed optimistically.
          patchState(store, {
            error: null
          });
        }),

        catchError(err => {

          // 4. Backend rejected deletion.
          // Restore the exact previous state.
          patchState(
            store,
            setAllEntities(previousSnapshot)
          );

          patchState(store, {
            error:
              err.error?.detail ??
              'Cannot delete course.'
          });

          return EMPTY;
        })

      ).subscribe();
    }

  }))
);