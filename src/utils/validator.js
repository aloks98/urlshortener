import * as yup from "yup";

const urlValidationSchema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    // eslint-disable-next-line no-useless-escape
    .matches(/[\w\-]/i),
  url: yup.string().url().required(),
});

export default urlValidationSchema;
