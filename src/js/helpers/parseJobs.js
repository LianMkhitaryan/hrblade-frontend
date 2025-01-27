import { add, format } from 'date-fns';
import locales from '../plugins/date-fns.js';
import app from '../../main.js';

const getRate = (answers) => {
  const answersCount = answers.length;

  const goodAnswersPercent =
    (answers.filter((answer) => answer === 'good').length / answersCount) * 100;
  const middlingAnswersPercent =
    (answers.filter((answer) => answer === 'middling').length / answersCount) *
    100;
  const badAnswersPercent =
    (answers.filter((answer) => answer === 'bad').length / answersCount) * 100;

  const maxPercent = Math.max(
    goodAnswersPercent,
    middlingAnswersPercent,
    badAnswersPercent
  );

  return {
    text:
      maxPercent === goodAnswersPercent
        ? app.$i18n.t('good')
        : maxPercent === middlingAnswersPercent
        ? app.$i18n.t('middling')
        : maxPercent === badAnswersPercent
        ? app.$i18n.t('bad')
        : 'notrated',
    value:
      maxPercent === goodAnswersPercent
        ? 'good'
        : maxPercent === middlingAnswersPercent
        ? 'middling'
        : maxPercent === badAnswersPercent
        ? 'bad'
        : 'notrated',
    percent: maxPercent ? maxPercent.toFixed(0) : app.$i18n.t('not_rated')
  };
};

const parseQuestions = (questions, noSort) => {
  const q = questions.map(
    ({
      id,
      default_id,
      type,
      question,
      image,
      video,
      video_link,
      time,
      preparation_time,
      is_count,
      points,
      tests,
      sorting,
      retake,
      language_answer,
      copyscape_check
    }) => ({
      question_id: id,
      type,
      questionDefaultId: default_id,
      isQuestionDefaultEdit: false,
      question,
      imageFile: null,
      imageFilePreview: image,
      videoQuestion: video,
      videoQuestionLink: video_link,
      time,
      lngbcp: language_answer || 'en-US',
      preparationTime: preparation_time || 'Unlim',
      is_count: !!is_count,
      points,
      sorting,
      retake: !!retake,
      plagiarism: !!copyscape_check,
      tests: tests
        ? tests.map(({ id, text, correct }) => ({
            test_id: id,
            text,
            correct: !!correct
          }))
        : [
            {
              text: '',
              correct: false
            }
          ]
    })
  );

  if (noSort) {
    return q;
  }

  return q.sort((a, b) => a.sorting - b.sorting);
};

const parseResponses = (responses) => {
  return responses
    .map(
      ({
        id,
        job_id,
        created_at,
        full,
        phone,
        email,
        note,
        invited,
        location,
        rating,
        status,
        pipeline,
        pipeline_index,
        preview_image,
        answers
      }) => ({
        id,
        jobId: job_id,
        createdDate: created_at,
        createdAt: format(new Date(created_at), 'dd MMM yyyy', {
          locale: locales[app.$i18n.locale]
        }),
        name: full || email,
        phone,
        email,
        note,
        location: location || '',
        invited: !!invited,
        rating,
        status,
        pipeline,
        pipelineIndex: pipeline_index,
        rate: answers
          ? getRate(
              answers.map((answer) => answer.rate).filter((answer) => !!answer)
            )
          : null,
        videoThumb: preview_image
        // answers: answers
        //   ? answers.map(({ id, video_thumb }) => ({
        //       id,
        //       videoThumb: video_thumb
        //     }))
        //   : null
      })
    )
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
};

const parseJobs = (job, noSort = false) => {
  const {
    id,
    agency_id,
    company_id,
    role_id,
    industry_id,
    active,
    created_at,
    updated_at,
    start_at,
    expire_days,
    expire_date,
    for_follow_up,
    name,
    salary,
    description,
    questions,
    responses,
    location,
    interviewed_count,
    invited_count,
    hash_link,
    company,
    header_image,
    template,
    competences,
    pipelines,
    ask_cv,
    ask_motivation_letter,
    preview_video,
    block_try,
    random_order
  } = job;

  return {
    id,
    agencyId: agency_id,
    companyId: company_id,
    roleId: role_id,
    industryId: industry_id,
    active: !!active,
    createdAt: created_at,
    updatedAt: updated_at,
    startAt: start_at,
    startDate: format(new Date(start_at), 'dd MMM yyyy', {
      locale: locales[app.$i18n.locale]
    }),
    endDate: expire_days
      ? format(add(new Date(start_at), { days: expire_days }), 'dd MMM yyyy', {
          locale: locales[app.$i18n.locale]
        })
      : format(new Date(expire_date), 'dd MMM yyyy', {
          locale: locales[app.$i18n.locale]
        }),
    inviteExpiry: expire_days ? expire_days : undefined,
    interviewExpiry: expire_date ? expire_date : undefined,
    forfollowUp: !!for_follow_up,
    name,
    description: description || '',
    questions: questions ? parseQuestions(questions, noSort) : null,
    responses: responses ? parseResponses(responses) : [],
    competences: competences
      ? competences.map(({ id, name, score }) => ({
          id,
          title: name,
          value: score
        }))
      : [],
    pipelines: pipelines ? pipelines.map(({ id, name }) => ({ id, name })) : [],
    salary: salary || '',
    location: location || '',
    interviewedCount: interviewed_count,
    invitedCount: invited_count,
    hashLink: hash_link,
    cv: !!ask_cv,
    motivationLatter: !!ask_motivation_letter,
    company: company
      ? {
          id: company.id,
          name: company.name,
          logo: company.logo,
          location: company.location,
          website: company.website
        }
      : null,
    style: {
      template: template || null,
      headerImage: header_image
        ? header_image
        : company && company.header_image
        ? company.header_image
        : null,
      bgImage: company ? company.bg_image : null,
      bgColor: company ? company.bg_color : null,
      btnColor: company ? company.buttons_color : null
    },
    previewVideo: preview_video,
    blockTry: !!block_try,
    random_order: !!random_order
  };
};

export default parseJobs;
