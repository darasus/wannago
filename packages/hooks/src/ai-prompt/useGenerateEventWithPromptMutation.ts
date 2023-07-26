// import {toast} from 'sonner';
// import {trpc} from 'trpc/src/trpc';

// export function useGenerateEventWithPromptMutation() {
//   const {
//     data: eventData,
//     mutateAsync,
//     isLoading: isGeneratingEvent,
//     reset: resetEventData,
//   } = trpc.event.generateEventWithPrompt.useMutation({
//     onError: error => {
//       toast.error(error.message);
//     },
//   });

//   const generateImageWithEventTitleMutation =
//     trpc.event.generateImageWithPrompt.useMutation();

//   const generateEvent = async (prompt: string) => {
//     const {imagePrompt} = await mutateAsync({prompt});

//     await generateImageWithEventTitleMutation.mutate({
//       prompt: imagePrompt,
//     });
//   };

//   const imageData = generateImageWithEventTitleMutation.data
//     ? {
//         featuredImageSrc: generateImageWithEventTitleMutation.data.url,
//         featuredImagePreviewSrc:
//           generateImageWithEventTitleMutation.data.imageSrcBase64,
//         featuredImageHeight: generateImageWithEventTitleMutation.data.height,
//         featuredImageWidth: generateImageWithEventTitleMutation.data.width,
//       }
//     : {
//         featuredImageSrc: null,
//         featuredImagePreviewSrc: null,
//         featuredImageHeight: null,
//         featuredImageWidth: null,
//       };

//   const reset = () => {
//     resetEventData();
//     generateImageWithEventTitleMutation.reset();
//   };

//   return {
//     data: eventData ? {...eventData, ...imageData} : null,
//     generateEvent,
//     isGeneratingEvent,
//     isGeneratingImage: generateImageWithEventTitleMutation.isLoading,
//     reset,
//   };
// }

export {};
