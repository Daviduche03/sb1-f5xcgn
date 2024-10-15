import { registerRoot } from 'remotion';
import { Composition } from './Composition';

registerRoot(() => {
  return (
    <Composition
      id="MyComp"
      component={Composition}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
});