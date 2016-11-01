import RunPhantomInstance from './phantom';
import RunJsDomInstance from './jsDom';

const SelectInstance = (file, { accessibilityLevel, maxBuffer, template }) => {
  if (template) {
    return RunJsDomInstance(file, accessibilityLevel);
  } else {
    return RunPhantomInstance(file, accessibilityLevel, maxBuffer);
  }
};

export { SelectInstance as default };
