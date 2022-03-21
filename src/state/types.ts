import { Subject } from 'rxjs';

type TodoItem = {
  id: number;
  value: string;
  completed: boolean;
};

type ErrorResponse = {
  kind: 'errorResponse';
  errorMessage: string;
  errorCode: number;
};

type DataResponse = {
  kind: 'dataResponse';
  todoItems: [];
};

type InitialViewModel = { type: 'initial' };
type EmptyViewModel = { type: 'empty' };
type ErrorViewModel = { type: 'error' };
type LoadingViewModel = { type: 'loadingInitial' };

type IdealLoadedViewModel = { type: 'loadedIdeal' } & DataResponse;

type ErrorLoadedViewModel = { type: 'loadedError' } & ErrorResponse & DataResponse;

type PendingLoadedViewModel = { type: 'loadingTransaction' } & DataResponse;

type LoadedViewModel = IdealLoadedViewModel | ErrorLoadedViewModel | PendingLoadedViewModel;
type TodoViewModel = InitialViewModel | EmptyViewModel | ErrorViewModel | LoadingViewModel | LoadedViewModel;

type thunkState = 'pending' | 'fulfilled' | 'error';

type Action = {
  type: string;
  payload: any;
  state?: thunkState;
};

type Reducer<TViewModel> = (state: TViewModel, payload: any) => TViewModel;

type ActionDefinition = {
  pending: Reducer<TodoViewModel>;
  fulfilled: Reducer<TodoViewModel>;
  error: Reducer<TodoViewModel>;
};

type Orchestrator = (dispatcher: Subject<Action | Orchestrator>) => Promise<void>;

export type {
  TodoItem,
  ErrorResponse,
  DataResponse,
  TodoViewModel,
  LoadedViewModel,
  thunkState,
  Action,
  ActionDefinition,
  Orchestrator,
};
