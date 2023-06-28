import type { ProjectActionFlow } from '@prisma/client';

type ProjectActionFlowWithStatues = ProjectActionFlow & {
  originalStatus: {
    title: string;
  };
  finalStatus: {
    title: string;
  };
};

export default ProjectActionFlowWithStatues;
