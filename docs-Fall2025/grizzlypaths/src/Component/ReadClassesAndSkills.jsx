import { useState } from 'react';
import Papa from 'papaparse';
import { getDatabase, ref, push } from 'firebase/database';
import { app } from '../firebase';