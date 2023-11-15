import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import express from 'express';
import HTTPStatus from 'http-status';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger-output.json';
import cors from 'cors';
import { configMap } from './config';



const configOptions = {
  service: 'gmail',
  auth: {
    user: configMap.user,
    pass: configMap.password
  }
}


const transporter = nodemailer.createTransport(configOptions);
transporter.verify((error:any, success:any) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});
const app = express();
app.use(cors('*'));
const router = express.Router();

router.use(async (req:any, res:any, next:any) => {
  if (configMap.auth_api.length === 0) {
    next();
  }
  try {
    const authorization = req.headers.authorization;
    const response = await fetch(configMap.auth_api, {
      method: 'POST',
      headers: {
        authorization: authorization
      }
    });
    if (response.ok) {
      console.log(`[${new Date().toISOString()}] Authorized request`);
      next();
    } else {
      const data = await response.json();
      console.log(`[${new Date().toISOString()}] Unauthorized request:`, data);
      res.status(HTTPStatus.UNAUTHORIZED).send({ error: 'Unauthorized request' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error' });
  }
  

});
router.post('/mail', async (req:any, res:any) => {
  // #swagger.tags = ['Mail']
  // #swagger.summary = 'Send a mail to some recipients'
  // #swagger.description = 'Send a mail to some recipients'
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
  /* #swagger.requestBody = {
    required: true,
    content: {
      'application/json': {
        schema: {
          $ref: '#/definitions/Mail'
        }
      }
    }
  } */
  /* #swagger.responses[200] = {
    description: 'Email sent',
    schema: {
      $ref: '#/definitions/Message'
    }
  } */
  /* #swagger.responses[401] = {
    description: 'Unauthorized request',
    schema: {
      $ref: '#/definitions/Error'
    }
  } */
  /* #swagger.responses[500] = {
    description: 'Error',
    schema: {
      $ref: '#/definitions/Error'
    }
  } */

  const { subject, htmlBody, recipients} = req.body;

  const mailOptions = {
    from: configMap.user,
    to: recipients,
    subject,
    html: `Hello,<br><br>${htmlBody}<br><br>Best regards,<br>Welhome Team`
  };

  transporter.sendMail(mailOptions, (error:any, info:any) => {
    if (error) {
      console.error(error);
    }
    console.log(`${new Date().toISOString()} - Message sent to ${recipients}`);
  });

  res.status(HTTPStatus.OK).send({ message: 'Email sent' });
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(router);

app.listen(configMap.port, () => {
  console.log('Server started in port ' + configMap.port);
});
