import {create} from './handlers/create';
import {remove} from './handlers/remove';
import {validateEventVisibilityCode} from './handlers/validateEventVisibilityCode';
import {validateSignUpProtectionCode} from './handlers/validateSignUpProtectionCode';
import {update} from './handlers/update';
import {publish} from './handlers/publish';
import {getById} from './handlers/getById';
import {getByShortId} from './handlers/getByShortId';
import {getOrganizer} from './handlers/getOrganizer';
import {joinEvent} from './handlers/joinEvent';
import {cancelEvent} from './handlers/cancelEvent';
import {cancelEventByUserId} from './handlers/cancelEventByUserId';
import {getNumberOfAttendees} from './handlers/getNumberOfAttendees';
import {getAttendees} from './handlers/getAttendees';
import {getExamples} from './handlers/getExamples';
import {getRandomExample} from './handlers/getRandomExample';
import {getAllEventsAttendees} from './handlers/getAllEventsAttendees';
import {invitePastAttendee} from './handlers/invitePastAttendee';
import {inviteByEmail} from './handlers/inviteByEmail';
import {getMySignUp} from './handlers/getMySignUp';
import {getPublicEvents} from './handlers/getPublicEvents';
import {getMyEvents} from './handlers/getMyEvents';
import {getIsMyEvent} from './handlers/getIsMyEvent';
import {getMyTicketsByEvent} from './handlers/getMyTicketsByEvent';
import {generateEventCsvData} from './handlers/generateEventCsvData';
import {createTRPCRouter} from '../../trpc';

export const eventRouter = createTRPCRouter({
  create,
  remove,
  update,
  publish,
  getById,
  getByShortId,
  getOrganizer,
  joinEvent,
  cancelEvent,
  cancelEventByUserId,
  getNumberOfAttendees,
  getAttendees,
  getExamples,
  getRandomExample,
  getAllEventsAttendees,
  invitePastAttendee,
  inviteByEmail,
  getMySignUp,
  getPublicEvents,
  getMyEvents,
  getIsMyEvent,
  getMyTicketsByEvent,
  generateEventCsvData,
  validateEventVisibilityCode,
  validateSignUpProtectionCode,
});
