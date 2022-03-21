import { Action, ActionDefinition, DataResponse, ErrorResponse, Orchestrator, TodoViewModel } from './types';
import { BehaviorSubject } from 'rxjs';
import { filter, map, pairwise, skip, tap, withLatestFrom } from 'rxjs/operators';
import { fetchAllTodos } from './todoService';
import { atomWithObservable } from 'jotai/utils';

const initialFetchAction: ActionDefinition = {
  pending: () => {
    return { type: 'loadingInitial' };
  },

  fulfilled: (_, payload: DataResponse) => {
    return { type: 'loadedIdeal', ...payload };
  },

  error: (_, payload: ErrorResponse) => {
    return { type: 'error', ...payload };
  },
};

const initialLoadOrchestrator: Orchestrator = async dispatcher => {
  console.log('in orchestrator', dispatcher);
  dispatcher.next({ type: 'initialLoad', payload: null, state: 'pending' });

  const result = await fetchAllTodos();

  if (result && result.kind === 'dataResponse') {
    dispatcher.next({ type: 'initialLoad', payload: result, state: 'fulfilled' });
  } else {
    dispatcher.next({ type: 'initialLoad', payload: result, state: 'error' });
  }
};

const ACTIONS = new Map<string, ActionDefinition>();

const registerAction = (type: string, definition: ActionDefinition) => {
  ACTIONS.set(type, definition);
};

registerAction('initialLoad', initialFetchAction);

const dispatcherStream = new BehaviorSubject<Action | Orchestrator>({ type: 'dummy', payload: null });

const storeStream = dispatcherStream.pipe(
  skip(1),
  tap(item => console.log('processing item', item)),
  tap(item => {
    console.log('in orchestrator callsite', typeof item);
    if (typeof item === 'function') {
      console.log('received an orchestrator', item);
      (item as Orchestrator)(dispatcherStream);
    }
  }),
  filter(item => typeof item !== 'function'),
  map(item => item as Action),
  pairwise(),
  map(([action, prevState]) => {
    const reducer = ACTIONS.get(action.type);

    return reducer![action.state!](action.payload, prevState);
  }),
);

storeStream.subscribe(vm => console.log('in store stream subscriber', vm));

const dispatcherAtom = atomWithObservable(() => dispatcherStream);
const storeAtom = atomWithObservable(() => storeStream);

export { dispatcherStream, storeStream, initialLoadOrchestrator, dispatcherAtom, storeAtom };
