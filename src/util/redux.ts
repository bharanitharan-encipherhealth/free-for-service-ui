import { createAction } from "redux-actions";

const isPromise = (p: any): p is Promise<any> => p && p.then && p.catch;

export const createActionThunk = (type: string, fn: (...args: any[]) => any) => {
  const TYPE_START = `${type}_STARTED`;
  const TYPE_SUCCEEDED = `${type}_SUCCEEDED`;
  const TYPE_FAILED = `${type}_FAILED`;
  const TYPE_ENDED = `${type}_ENDED`;

  const actionCreators = {
    [TYPE_START]: createAction(TYPE_START),
    [TYPE_SUCCEEDED]: createAction(TYPE_SUCCEEDED),
    [TYPE_FAILED]: createAction(TYPE_FAILED),
    [TYPE_ENDED]: createAction(TYPE_ENDED),
  };

  const factory: any =
    (...args: any[]) =>
    (dispatch: any, getState: any, extra: any) => {
      let result: any;
      const startedAt = new Date().getTime();

      dispatch(actionCreators[TYPE_START](args));

      const succeeded = (data: any) => {
        const endedAt = new Date().getTime();

        dispatch(actionCreators[TYPE_SUCCEEDED](data));

        requestAnimationFrame(() => {
          dispatch(
            actionCreators[TYPE_ENDED]({
              elapsed: endedAt - startedAt,
            })
          );
        });

        return data;
      };

      const failed = (err: any) => {
        const endedAt = new Date().getTime();

        dispatch(actionCreators[TYPE_FAILED](err));

        requestAnimationFrame(() => {
          dispatch(
            actionCreators[TYPE_ENDED]({
              elapsed: endedAt - startedAt,
            })
          );
        });

        return err;
      };

      try {
        result = fn(...args, { getState, dispatch, extra });

        if (isPromise(result)) {
          return result.then(succeeded).catch(failed);
        }

        return succeeded(result);
      } catch (err) {
        return failed(err);
      }
    };

  factory.NAME = type;
  factory.START = (actionCreators[TYPE_START] as any).toString();
  factory.SUCCEEDED = (actionCreators[TYPE_SUCCEEDED] as any).toString();
  factory.FAILED = (actionCreators[TYPE_FAILED] as any).toString();
  factory.ENDED = (actionCreators[TYPE_ENDED] as any).toString();

  return factory;
};
