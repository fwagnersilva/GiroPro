import { isWeb } from '../../utils/platform';
import FormInputNative from './FormInput.native';
import FormInputWeb from './FormInput.web';

const FormInput = isWeb ? FormInputWeb : FormInputNative;

export default FormInput;

