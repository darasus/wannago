import {createTRPCRouter} from '../../trpc';

import {cancelEvent} from './handlers/cancelEvent';
import {cancelEventByUserId} from './handlers/cancelEventByUserId';
import {create} from './handlers/create';
import {generateEventCsvData} from './handlers/generateEventCsvData';
import {getAllEventsAttendees} from './handlers/getAllEventsAttendees';
import {getAttendees} from './handlers/getAttendees';
import {getById} from './handlers/getById';
import {getByShortId} from './handlers/getByShortId';
import {getMyEvents} from './handlers/getMyEvents';
import {getMySignUp} from './handlers/getMySignUp';
import {getNumberOfAttendees} from './handlers/getNumberOfAttendees';
import {getPublicEvents} from './handlers/getPublicEvents';
import {inviteByEmail} from './handlers/inviteByEmail';
import {invitePastAttendee} from './handlers/invitePastAttendee';
import {joinEvent} from './handlers/joinEvent';
import {publish} from './handlers/publish';
import {remove} from './handlers/remove';
import {update} from './handlers/update';
import {validateEventVisibilityCode} from './handlers/validateEventVisibilityCode';
import {validateSignUpProtectionCode} from './handlers/validateSignUpProtectionCode';

export const eventRouter = createTRPCRouter({
  create,
  remove,
  update,
  publish,
  getById,
  getByShortId,
  joinEvent,
  cancelEvent,
  cancelEventByUserId,
  getNumberOfAttendees,
  getAttendees,
  getAllEventsAttendees,
  invitePastAttendee,
  inviteByEmail,
  getMySignUp,
  getPublicEvents,
  getMyEvents,
  generateEventCsvData,
  validateEventVisibilityCode,
  validateSignUpProtectionCode,
});
