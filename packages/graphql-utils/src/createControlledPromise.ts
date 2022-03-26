export interface ControlledPromise<T> extends Promise<T> {
  reject: (reason: any) => void;
  resolve: (value: T) => void;
}

const createControlledPromise = <T>(): ControlledPromise<T> => {
  let controls!: { reject: (reason: any) => void; resolve: (value: T) => void };

  const controlledPromise = new Promise<T>((resolve, reject) => {
    controls = { resolve, reject };
  });

  return Object.assign(controlledPromise, controls);
};

export default createControlledPromise;
