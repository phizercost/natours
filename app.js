const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1. Global Middlewares

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//set Security HTTP Headers
app.use(helmet());

//Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //Does the logging for us
}

//Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour!'
});

app.use('/api', limiter);

//Middleware to add the body data to the request.
//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//Parse data for cookies
app.use(cookieParser());

//Data sanitazion against NoSQL query injection
app.use(mongoSanitize());

//Data sanitazition against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'maxGroupSize',
      'ratingsAverage',
      'difficulty',
      'price'
    ]
  })
);

app.use(compression())

//Test middlewares
app.use((req, res, next) => {
  //console.log('Hello from the Middleware');
  //next needs to be executed for the cycle to continue
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.cookies);
  next();
});

//2. ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//Handling unhandled routes. Always to be put at the end in order for this not to block other succesfull requests
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`
  // })

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

//Error handling middleware

app.use(globalErrorHandler);

module.exports = app;
