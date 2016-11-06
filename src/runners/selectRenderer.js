import RunPhantomInstance from './phantom';
import RunJsDomInstance from './jsDom';

const SelectInstance = (file, { accessibilityLevel, maxBuffer, browser }) => {
  if (browser) {
    return RunPhantomInstance(file, accessibilityLevel, maxBuffer);
  } else {
    return RunJsDomInstance(file, accessibilityLevel);
  }
};

export { SelectInstance as default };
