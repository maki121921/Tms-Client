import { computed, inject } from '@angular/core';

import {
  signalStore,
  withComputed,
  withMethods,
  patchState,
  withState
} from '@ngrx/signals';

import {
  withEntities,
  setAllEntities,
  updateEntity
} from '@ngrx/signals/entities';

import { rxMethod } from '@ngrx/signals/rxjs-interop';

import {
  pipe,
  concatMap,
  tap,
  catchError,
  EMPTY
} from 'rxjs';

import { EnrollmentService } from '../services/enrollment';
import { Enrollment } from '../models/enrollment.model';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },

  // Simple state properties
  withState({
    isLoading: false,
    error: null as string | null
  }),

  // Centralized enrollment collection
  withEntities<Enrollment>(),

  // Derived state
  withComputed((store) => ({
    pendingCount: computed(
      () =>
        store.entities()
          .filter(enrollment => enrollment.status === 'Pending')
          .length
    )
  })),

  // Store methods
  withMethods((store, api = inject(EnrollmentService)) => ({

    // Load all enrollments
    loadEnrollments: rxMethod<void>(
      pipe(
        tap(() =>
          patchState(store, {
            isLoading: true,
            error: null
          })
        ),

        concatMap(() =>
          api.getAll().pipe(

            tap(rows =>
              patchState(
                store,
                setAllEntities(rows),
                {
                  isLoading: false
                }
              )
            ),

            catchError(err => {
              patchState(store, {
                isLoading: false,
                error: err.message
              });

              return EMPTY;
            })
          )
        )
      )
    ),

    // Optimistic approval
    approveEnrollment: rxMethod<number>(
      pipe(

        // Step 1: Update UI immediately
        tap(id => {
          patchState(
            store,
            updateEntity({
              id,
              changes: {
                status: 'Approved'
              }
            })
          );
        }),

        // Step 2: Send request to API
        concatMap(id =>
          api.approve(id).pipe(

            // Step 3: Roll back if server rejects
            catchError(err => {

              patchState(
                store,
                updateEntity({
                  id,
                  changes: {
                    status: 'Pending'
                  }
                })
              );

              patchState(store, {
                error:
                  'Server rejected the approval. Check enrollment constraints.'
              });

              return EMPTY;
            })
          )
        )
      )
    )
  }))
);