<!-- eslint-disable prettier/prettier -->
<template>
  <app-page class="page-job-edit" :loading="appLoading || pageLoading">
    <template slot="header">
      <a-breadcrumb class="mb-5" separator=">">
        <a-breadcrumb-item>
          <router-link to="/">
            {{ $t('breadcrumbs.jobs') }}
          </router-link>
        </a-breadcrumb-item>

        <a-breadcrumb-item>{{ pageTitle }}</a-breadcrumb-item>
      </a-breadcrumb>

      <!-- <page-title>{{ pageTitle }}</page-title> -->
    </template>

    <a-row :gutter="{ lg: 20, md: 10, sm: 10, xs: 10 }">
      <a-col :span="24">
        <card>
          <a-form>
            <a-steps class="mb-40" :current="step" @change="onChangeStep">
              <a-step v-for="(step, index) in steps" :key="index">
                <template slot="title">
                  {{ step }}
                </template>

                <template slot="icon">
                  {{ index + 1 }}
                </template>
              </a-step>
            </a-steps>

            <div v-show="step == 0" class="steps-content">
              <div class="page-job-edit-autoedit-toggle">
                <button @click="isAutoeditVisible = !isAutoeditVisible">
                  {{
                    $t('Job interview questions and job description templates')
                  }}
                  {{ isAutoeditVisible ? '-' : '+' }}
                </button>
              </div>

              <div v-if="isAutoeditVisible" class="page-job-edit-autoedit">
                <div class="mb-10">
                  <b>
                    <small>
                      {{
                        $t(
                          'Interview questions and job descriptions database (with AI-powered and video questions)'
                        )
                      }}
                    </small>
                  </b>
                </div>

                <a-row :gutter="[{ lg: 20, md: 10, sm: 10, xs: 10 }, 20]">
                  <a-col :sm="18" :span="24">
                    <a-form-item has-feedback :label="autoedit.value && $t('Job Title')">
                      <a-auto-complete v-model="autoedit.value" :data-source="autoeditData" :placeholder="$t('Job Title')"
                        @search="(searchText) =>
                            (autoeditData = roles
                              .map((role) => role.name)
                              .filter(
                                (role) =>
                                  role
                                    .toLowerCase()
                                    .indexOf(searchText.toLowerCase()) >= 0
                              ))
                            " />
                    </a-form-item>
                  </a-col>

                  <a-col :sm="6" :span="24">
                    <app-button type="primary" size="large" block @click="generateQuestions">
                      {{ $t('Fill') }}
                    </app-button>
                  </a-col>

                  <a-col :span="24">
                    <div class="page-job-edit-autoedit-settings">
                      <div>
                        {{ $t('Create from template:') }}
                      </div>

                      <div class="page-job-edit-autoedit-settings-controls">
                        <a-checkbox :checked="autoeditIsIsDescription" @change="(e) => (autoeditIsIsDescription = e.target.checked)
                          ">
                          {{ $t('Job Desciption') }}
                        </a-checkbox>

                        <a-checkbox :checked="autoeditIsQuestion" @change="(e) => (autoeditIsQuestion = e.target.checked)
                          ">
                          {{ $t('Questions') }}
                        </a-checkbox>
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </div>

              <a-form-item has-feedback :label="data.name.value && $t('placeholders.interview_title')"
                :validate-status="data.name.status">
                <a-input v-model="data.name.value" :placeholder="$t('placeholders.interview_title')" />
              </a-form-item>

              <a-form-item has-feedback :label="data.company.value && $t('placeholders.company')"
                :validate-status="data.company.status">
                <a-select :placeholder="$t('placeholders.company')" :defaultActiveFirstOption="false"
                  :value="data.company.value" @change="onChangeCompany">
                  <div slot="suffixIcon">
                    <icon-arrow-down />
                  </div>

                  <div slot="notFoundContent" class="d-flex justify-content-center">
                    <router-link to="/companies/create">
                      <app-button type="link">
                        {{ `+ ${$t('page_company_create.title')}` }}
                      </app-button>
                    </router-link>
                  </div>

                  <a-select-option v-for="company in companies" :key="company.id" :value="company.id">
                    {{ company.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item has-feedback :label="data.location.value && $t('placeholders.location')"
                :validate-status="data.location.status">
                <a-input v-model="data.location.value" :placeholder="$t('placeholders.location')" />
              </a-form-item>

              <a-form-item has-feedback :label="data.salary.value && $t('placeholders.salary')"
                :validate-status="data.salary.status">
                <a-input v-model="data.salary.value" :placeholder="$t('placeholders.salary')" />
              </a-form-item>

              <a-form-item has-feedback class="ant-form-item-children-block" :validate-status="data.description.status">
                <text-editor :value="data.description.value" @update="(val) => (data.description.value = val)" />
              </a-form-item>

              <a-row :gutter="20">
                <a-col :sm="{ span: 12 }" :span="24">
                  <a-form-item>
                    <div class="remove-right-top">
                      <upload ref="uploadHeaderImagePreview" accept="image/*" :label="$t('upload_header_image')"
                        :placeholder="headerImagePreview" @change="onChangeHeaderImage" />

                      <div v-if="headerImagePreview || data.headerImage" class="remove-right-top-icon" @click="() => {
                          headerImagePreview = null;
                          data.headerImage = null;
                          $refs.uploadHeaderImagePreview.removePreview();
                        }
                        ">
                        <IconDel />
                      </div>
                    </div>
                  </a-form-item>
                </a-col>

                <a-col :sm="{ span: 12 }" :span="24">
                  <a-form-item>
                    <a-radio-group v-model="data.template.value" @change="onChangeTemplate" class="template-radio-group">
                      <a-radio v-for="(teplate, index) in teplates" :key="index" :value="teplate.name">
                        <div class="template-radio-group-item">
                          <components :is="teplate.icon" />

                          <span>
                            {{ teplate.title }}
                          </span>
                        </div>
                      </a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

            <div v-show="step == 1" class="steps-content">
              <card v-for="(item, index) in data.questions" :key="`${index}-${index.questionDefaultId}`"
                class="question-item">
                <a-form-item has-feedback :validate-status="data.questions[index].status">
                  <!-- Question controls -->
                  <div class="ant-form-item-label custome">
                    <div class="d-flex align-items-center">
                      {{ `${index + 1}.` }}

                      <!-- Sort question -->
                      <div class="ml-10">
                        <a-button v-if="data.questions.length > 1 && !item.id" size="small" type="link"
                          @click="handleUpQuestion(index)">
                          <icon-chevron-up />
                        </a-button>

                        <a-button v-if="data.questions.length > 1 && !item.id" size="small" type="link"
                          @click="handleDownQuestion(index)">
                          <icon-chevron-down />
                        </a-button>
                      </div>

                      <!-- Delete question -->
                      <a-button v-if="data.questions.length > 1 &&
                        !item.id &&
                        isEditableQuestions
                        " size="small" type="link" @click.stop.prevent="deleteQuestion(index)">
                        <icon-del />
                      </a-button>

                      <!-- Questions library -->
                      <app-button class="ml-10" size="small" style="height: 30px;" :disabled="!isEditableQuestions"
                        @click.stop.prevent="() => onOpenLib(index)">
                        {{ $t('Select question') }}
                      </app-button>
                    </div>

                    <!-- Change question type -->
                    <div class="simple-select ml-auto mt-md-20">
                      <icon-question class="simple-select-icon" />

                      <span class="simple-select-name">
                        {{ $t('question_type') }}:
                      </span>

                      <a-select class="simple" dropdownClassName="simple" :disabled="!isEditableQuestions" :key="index"
                        :value="item.type" :default-value="item.type" :showArrow="false" @change="(val) => {
                            data.questions[index].type = val;
                            data.questions[index].time = isEnterprise
                              ? val !== 'VIDEO'
                                ? enterpriseTimes1h[
                                enterpriseTimes1h.length - 1
                                ]
                                : enterpriseTimes[0]
                              : val !== 'VIDEO'
                                ? times1h[times1h.length - 1]
                                : times[0];
                            checkVideoQuestionsLimit();
                          }
                          ">
                        <template slot="notFoundContent">
                          <div class="ant-empty ant-empty-normal ant-empty-small">
                            <div class="ant-empty-image">
                              <icon-more fill="rgba(0, 0, 0, 0.25)" />
                            </div>
                            <p class="ant-empty-description">
                              {{ $t('no_data') }}
                            </p>
                          </div>
                        </template>

                        <a-select-option v-for="type in questionType" :key="`${type.name}-${index}`" :value="type.name">
                          <b class="text-black">
                            {{ type.title }}
                          </b>
                        </a-select-option>
                      </a-select>
                    </div>

                    <div class="simple-select ml-20 mt-md-20">
                      <icon-question class="simple-select-icon" />

                      <span class="simple-select-name">
                        {{ $t('question_lang') }}:
                      </span>

                      <a-select class="simple" dropdownClassName="simple" :key="index"
                        :value="data.questions[index].lngbcp" :showArrow="false"
                        @change="(val) => data.questions[index].lngbcp = val">
                        <template slot="notFoundContent">
                          <div class="ant-empty ant-empty-normal ant-empty-small">
                            <div class="ant-empty-image">
                              <icon-more fill="rgba(0, 0, 0, 0.25)" />
                            </div>
                            <p class="ant-empty-description">
                              {{ $t('no_data') }}
                            </p>
                          </div>
                        </template>

                        <a-select-option v-for="lb in bcp" :key="`${lb.tag}-${index}`" :value="lb.tag">
                          <b class="text-black">
                            {{ $t(`${lb.title}`) }}
                          </b>
                        </a-select-option>
                      </a-select>
                    </div>
                  </div>

                  <template v-if="item.type === 'TEST'">
                    <a-row type="flex" :gutter="[20, 20]">
                      <a-col :span="24">
                        <a-input v-model="item.question" type="textarea"
                          :placeholder="$t('placeholders.enter_question')" />
                      </a-col>

                      <a-col :span="24" class="self-center">
                        <a-checkbox :checked="item.is_count" @change="(e) =>
                          (data.questions[index].is_count =
                            e.target.checked)
                          ">
                          <b class="text-black">
                            {{ $t('count_points') }}
                          </b>
                        </a-checkbox>

                        <div v-show="item.is_count" class="mt-20 text-black">
                          <b>{{ $t('points_for_correct_answer') }}</b>
                          <a-input-number class="ml-10" v-model="item.points" :disabled="!item.is_count" :min="0" />
                        </div>
                      </a-col>
                    </a-row>

                    <a-row :gutter="[20, 20]">
                      <a-col class="mt-10" :span="24">
                        <page-title tag="div" size="16" class="mb-0-i">
                          {{ $t('answers_list') }}
                        </page-title>
                      </a-col>

                      <a-col v-for="(answer, index2) in item.tests" :key="index2" :span="24">
                        <div class="d-flex align-items-center justify-content-between">
                          <a-input v-model="answer.text" :placeholder="$t('placeholders.answer')" />

                          <a-button v-if="item.tests.length > 1 && isEditableQuestions" class="ml-10" size="small"
                            type="link" @click="deleteAnswer(index, index2)">
                            <icon-del />
                          </a-button>

                          <a-checkbox class="flex-shrink-0 ml-10" :checked="answer.correct"
                            @change="(e) => (answer.correct = e.target.checked)">
                            <b class="text-black">{{ $t('correct_answer') }}</b>
                          </a-checkbox>
                        </div>
                      </a-col>

                      <a-col v-if="isEditableQuestions" :span="24">
                        <app-button @click="addAnswer(index)">
                          {{ $t('add_answer') }}
                        </app-button>
                      </a-col>
                    </a-row>
                  </template>

                  <a-input v-else v-model="item.question" type="textarea" :placeholder="$t('placeholders.enter_question')"
                    @input="() => onInputQuestionText(index)" @blur="() => onBlurQuestionText(index)" />

                  <a-row class="mt-40" :gutter="20">
                    <a-col :span="12">
                      <upload :key="item.imageFilePreview" ref="uploadImageFileRef"
                        accept="image/png, image/jpg, image/jpeg" :label="$t('Upload your image')"
                        :placeholder="item.imageFilePreview" @change="(file) => {
                            item.imageFile = file;
                            getBase64(
                              file,
                              (base64) => (item.imageFilePreview = base64)
                            );
                          }
                          " />

                      <div v-if="item.imageFile || item.imageFilePreview" class="remove-right-top-icon"
                        @click.stop.prevent="() => {
                            $refs.uploadImageFileRef[index].removePreview();
                            item.imageFile = null;
                            item.imageFilePreview = null;
                          }
                          ">
                        <IconDel />
                      </div>
                    </a-col>

                    <a-col v-if="item.videoQuestion" :span="12">
                      <!-- <video-player
                        :key="item.videoQuestion"
                        :src="item.videoQuestion"
                      /> -->
                      <video :key="item.videoQuestion" controls crossorigin playsinline width="100%">
                        <source :src="item.videoQuestion" />
                      </video>

                      <div class="remove-right-top-icon" @click="() => (item.videoQuestion = null)">
                        <IconDel />
                      </div>

                      <!-- <div v-if="item.questionDefaultId !== null" class="mt-10">
                        <div>
                          <b style="color: #f539f9">AI</b>
                          {{
                            $t(
                              'This question includes AI assessments function. If you change it, this function will be
                                                    disabled.'
                            )
                          }}
                        </div>
                      </div> -->
                    </a-col>

                    <!-- <a-col v-else :span="12">
                      <upload
                        ref="uploadVideoFileRef"
                        label="Upload your video"
                        accept="video/mp4"
                        @change="(file) => (item.videoFile = file)"
                      />

                      <div
                        v-if="item.videoFile"
                        class="remove-right-top-icon"
                        @click.stop.prevent="
                          () => {
                            $refs.uploadVideoFileRef[index].removePreview();
                            item.videoFile = null;
                          }
                        "
                      >
                        <IconDel />
                      </div>
                    </a-col> -->
                  </a-row>

                  <div class="question-item-footer">
                    <a-row :gutter="[10, 10]">
                      <a-col :span="14">
                        <a-row :gutter="[10, 10]">
                          <!-- Change question time -->
                          <a-col :lg="12" :span="24">
                            <div class="simple-select">
                              <icon-time class="simple-select-icon" />

                              <span class="simple-select-name">
                                {{ $t('answer_time') }}:
                              </span>

                              <a-select class="simple" dropdownClassName="simple" :key="index" :value="item.time"
                                :default-value="item.time" :showArrow="false" @change="(val) => (data.questions[index].time = val)
                                  ">
                                <template slot="notFoundContent">
                                  <div class="ant-empty ant-empty-normal ant-empty-small">
                                    <div class="ant-empty-image">
                                      <icon-more fill="rgba(0, 0, 0, 0.25)" />
                                    </div>

                                    <p class="ant-empty-description">
                                      {{ $t('no_data') }}
                                    </p>
                                  </div>
                                </template>

                                <a-select-option v-for="time in isEnterprise
                                  ? data.questions[index].type !== 'VIDEO'
                                    ? enterpriseTimes1h
                                    : enterpriseTimes
                                  : data.questions[index].type !== 'VIDEO'
                                    ? times1h
                                    : times" :key="`${time}-index`" :value="time">
                                  <b class="text-black">
                                    {{ time }}
                                  </b>
                                </a-select-option>
                              </a-select>
                            </div>
                          </a-col>

                          <!-- Change question preparation time -->
                          <a-col :lg="12" :span="24">
                            <div class="simple-select">
                              <icon-time class="simple-select-icon" />

                              <span class="simple-select-name">
                                {{ $t('Preparation time') }}:
                              </span>

                              <a-select class="simple" dropdownClassName="simple" :key="index"
                                :value="item.preparationTime" :default-value="item.preparationTime" :showArrow="false"
                                @change="(val) => {
                                    data.questions[index].preparationTime = val;
                                    if (val !== 'Unlim')
                                      data.questions[index].retake = false;
                                  }
                                  ">
                                <template slot="notFoundContent">
                                  <div class="ant-empty ant-empty-normal ant-empty-small">
                                    <div class="ant-empty-image">
                                      <icon-more fill="rgba(0, 0, 0, 0.25)" />
                                    </div>

                                    <p class="ant-empty-description">
                                      {{ $t('no_data') }}
                                    </p>
                                  </div>
                                </template>

                                <a-select-option v-for="time in preparationTimes" :key="`${time}-index`" :value="time">
                                  <b class="text-black">
                                    {{
                                      time === 'Unlim' ? '&#8734; min' : time
                                    }}
                                  </b>
                                </a-select-option>
                              </a-select>
                            </div>
                          </a-col>
                        </a-row>
                      </a-col>

                      <a-col v-if="data.questions[index].type !== 'TEST'" :key="`${index}-${index.questionDefaultId}`"
                        :span="10">
                        <a-row :gutter="[10, 10]">
                          <a-col v-if="isEnterprise" :span="24">
                            <a-checkbox class="flex-shrink-0" :checked="data.questions[index].plagiarism" @change="(e) =>
                                onChangePlagiarism(index, e.target.checked)
                              ">
                              <b class="text-black">
                                {{ $t('Enable plagiarism check') }}
                              </b>
                            </a-checkbox>
                          </a-col>

                          <a-col v-if="data.questions[index].type === 'VIDEO'" :span="24">
                            <a-checkbox class="flex-shrink-0" :disabled="data.questions[index].preparationTime !==
                              'Unlim'
                              " :checked="data.questions[index].retake" @change="(e) =>
    (data.questions[index].retake =
      e.target.checked)
    ">
                              <b class="text-black">
                                {{ $t('enable_retake_option') }}
                              </b>
                            </a-checkbox>
                          </a-col>
                        </a-row>
                      </a-col>
                    </a-row>
                  </div>
                </a-form-item>
              </card>

              <a-form-item v-if="isEditableQuestions">
                <app-button type="primary" ghost class="mt-20" @click="createQuestions">
                  {{ $t('create_question') }}
                </app-button>
              </a-form-item>
            </div>

            <div v-show="step == 2" class="steps-content">
              <a-row type="flex" align="bottom" :gutter="[
                  { lg: 20, sm: 10, xs: 10 },
                  { lg: 0, sm: 10, xs: 10 }
                ]">
                <a-col :lg="12" :span="24">
                  <a-form-item has-feedback :label="data.interviewExpiry.value &&
                    $t('placeholders.live_until')
                    " :validate-status="data.interviewExpiry.status">
                    <a-date-picker v-model="data.interviewExpiry.value" :placeholder="$t('placeholders.live_until')"
                      :valueFormat="dateFormat" :disabled-date="disabledDate" style="width: 100%" />
                  </a-form-item>
                </a-col>
              </a-row>

              <div class="mt-25 mb-25">
                <a-row :gutter="[
                    { lg: 20, sm: 10, xs: 10 },
                    { lg: 0, sm: 40, xs: 40 }
                  ]">
                  <a-col :lg="16">
                    <page-title tag="h3" size="16">
                      {{ $t('your_ideal_profile_of_candidate') }}
                    </page-title>

                    <div v-if="data.competences.length" class="competencies-list">
                      <div class="competencies-list-item mb-10">
                        <div class="competencies-list-item-title">
                          <page-title tag="h3" size="16" class="mb-0">
                            {{ $t('competences') }}
                          </page-title>
                        </div>

                        <div class="competencies-list-item-rate">
                          <page-title tag="h3" size="16" class="mb-0">
                            {{ $t('rate_percent') }}
                          </page-title>
                        </div>

                        <div class="competencies-list-item-actions"></div>
                      </div>

                      <div v-for="(competence, index) in data.competences" :key="index" class="competencies-list-item">
                        <div class="competencies-list-item-title">
                          <a-input v-model="competence.title" :placeholder="$t('placeholders.title')" />
                        </div>

                        <div class="competencies-list-item-rate">
                          <a-input v-model="competence.value" :placeholder="$t('placeholders.rate_percent')" />
                        </div>

                        <div class="competencies-list-item-actions">
                          <div class="d-flex align-items-center">
                            <div>
                              <a-button size="small" type="link" @click="handleUpCompetence(index)">
                                <icon-chevron-up />
                              </a-button>

                              <a-button size="small" type="link" @click="handleDownCompetence(index)">
                                <icon-chevron-down />
                              </a-button>
                            </div>

                            <a-popconfirm :title="`${$t('are_you_sure')}?`" @confirm="deleteCompetence(index)">
                              <a-button size="small" type="link">
                                <icon-del class="fill-warning" />
                              </a-button>
                            </a-popconfirm>
                          </div>
                        </div>
                      </div>
                    </div>

                    <app-button class="mt-40" @click="addNewCompetence">
                      {{ $t('add_your_own') }}
                    </app-button>
                  </a-col>

                  <a-col :lg="8">
                    <a-form-item :label="currentCompetenseId && $t('placeholders.tech_hiring')
                      ">
                      <a-select :placeholder="$t('placeholders.tech_hiring')" :defaultActiveFirstOption="false"
                        :value="currentCompetenseId" @change="onChangeCompetense">
                        <div slot="suffixIcon">
                          <icon-arrow-down />
                        </div>

                        <template slot="notFoundContent">
                          <div class="ant-empty ant-empty-normal ant-empty-small">
                            <div class="ant-empty-image">
                              <icon-more fill="rgba(0, 0, 0, 0.25)" />
                            </div>

                            <p class="ant-empty-description">
                              {{ $t('no_data') }}
                            </p>
                          </div>
                        </template>

                        <a-select-option v-for="competense in competenses" :key="competense.id" :value="competense.id">
                          {{ competense.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>

                    <div v-if="step === 2 && data.competences.length >= 3" class="mt-20">
                      <radar-chart :chart-data="chartData" />
                    </div>
                  </a-col>
                </a-row>
              </div>

              <a-divider />

              <div class="mt-25 mb-25">
                <a-row :gutter="[
                    { lg: 20, sm: 10, xs: 10 },
                    { lg: 0, sm: 40, xs: 40 }
                  ]">
                  <a-col :lg="16">
                    <page-title tag="h3" size="16">
                      {{ $t('Pipeline') }}
                    </page-title>

                    <div v-if="data.pipelines.length" class="competencies-list">
                      <div v-for="(pipeline, index) in data.pipelines" :key="index" class="competencies-list-item">
                        <div class="competencies-list-item-title">
                          <a-input v-model="pipeline.name" :placeholder="$t('placeholders.title')" />
                        </div>

                        <div class="competencies-list-item-actions">
                          <div class="d-flex align-items-center">
                            <div>
                              <a-button size="small" type="link" @click="handleUpPipeline(index)">
                                <icon-chevron-up />
                              </a-button>

                              <a-button size="small" type="link" @click="handleDownPipeline(index)">
                                <icon-chevron-down />
                              </a-button>
                            </div>

                            <a-popconfirm :title="`${$t('are_you_sure')}?`" @confirm="deletePipeline(index)">
                              <a-button size="small" type="link">
                                <icon-del class="fill-warning" />
                              </a-button>
                            </a-popconfirm>
                          </div>
                        </div>
                      </div>
                    </div>

                    <app-button class="mt-40" @click="addNewPipeline">
                      {{ $t('add_your_own') }}
                    </app-button>
                  </a-col>
                </a-row>
              </div>

              <a-divider />

              <div class="mt-25">
                <a-row>
                  <a-col :span="24">
                    <page-title tag="h3" size="16" class="mb-40">
                      {{ `${$t('additional_files')} (${$t('optional')})` }}
                    </page-title>

                    <a-col :span="24">
                      <a-form-item>
                        <a-checkbox :checked="data.cv" @change="(e) => (data.cv = e.target.checked)">
                          <b class="text-black">
                            {{ $t('ask_for_cv') }}
                          </b>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>

                    <a-col :span="24">
                      <a-form-item>
                        <a-checkbox :checked="data.motivationLatter" @change="(e) => (data.motivationLatter = e.target.checked)
                          ">
                          <b class="text-black">
                            {{ $t('ask_for_motivational_letter') }}
                          </b>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                  </a-col>
                </a-row>
              </div>

              <a-divider />

              <div class="mt-25">
                <a-row>
                  <a-col :span="24">
                    <page-title tag="h3" size="16" class="mb-40">
                      {{ $t('Security') }}
                    </page-title>

                    <a-col :span="24">
                      <a-form-item>
                        <a-checkbox :checked="data.blockTry" @change="(e) => (data.blockTry = e.target.checked)">
                          <b class="text-black">
                            {{
                              $t('Block invitation link after start interview')
                            }}
                          </b>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>

                    <!-- <a-col :span="24">
                      <a-form-item>
                        <a-checkbox
                          :checked="data.isBlockIpAddress"
                          @change="
                            (e) => (data.isBlockIpAddress = e.target.checked)
                          "
                        >
                          <b class="text-black">
                            {{
                              $t(
                                'Allow one interview from one IP-address via share invitation link'
                              )
                            }}
                          </b>
                        </a-checkbox>
                      </a-form-item>
                    </a-col> -->
                  </a-col>
                </a-row>
              </div>

              <a-divider />

              <div class="mt-25">
                <a-row>
                  <a-col :span="24">
                    <page-title tag="h3" size="16" class="mb-40">
                      {{ $t('Additional settings') }}
                    </page-title>

                    <a-col :span="24">
                      <a-form-item>
                        <a-checkbox :checked="data.random_order" @change="(e) => (data.random_order = e.target.checked)
                          ">
                          <b class="text-black">
                            {{ $t('Shuffle questions') }}
                          </b>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                  </a-col>
                </a-row>
              </div>
            </div>

            <a-form-item class="job-edit-footer-actions">
              <router-link v-if="step == 0" to="/">
                <app-button size="large" class="ml-10">
                  {{ $t('cancel') }}
                </app-button>
              </router-link>

              <app-button v-else size="large" class="ml-10" @click="step--">
                {{ $t('back') }}
              </app-button>

              <app-button type="primary" size="large" class="ml-10" :loading="loadPublish" @click="nextStep">
                {{ step === 2 ? $t('publish') : $t('next') }}
              </app-button>
            </a-form-item>
          </a-form>
        </card>
      </a-col>
    </a-row>

    <a-modal centered width="920px" :visible="isLibOpen" :footer="null" @cancel="onCloseLibModal">
      <a-row>
        <a-col :span="24">
          <page-title tag="h2" size="16">
            {{ $t('Question database') }}
          </page-title>
        </a-col>

        <a-col :span="24">
          <a-row type="flex" :gutter="[20, 20]">
            <a-col :md="8" :span="24">
              <a-button v-for="item in libCategories" :key="item.id" :class="[
                  'lib-modal-btn',
                  { 'lib-modal-btn-current': item.id === currentLibCategory }
                ]" block type="link" @click="() => onChangeLibCategory(item.id)">
                <b>
                  {{ item.name }}
                </b>
              </a-button>
            </a-col>

            <a-col :md="16" :span="24">
              <a-row :gutter="[0, 20]">
                <a-col :span="24">
                  <a-input v-model="libFilter.search" size="small" :placeholder="$t('placeholders.search_by_name')">
                    <icon-search slot="prefix" class="ant-input-prefix-icon" />
                  </a-input>
                </a-col>

                <a-col :span="24">
                  <div class="lib-modal-questions">
                    <a-checkbox v-for="q in libQuestionsByCategoriesFiltred" :key="q.id"
                      :checked="q.id === checkedQuestion" @change="() => (checkedQuestion = q.id)">
                      {{ q.question }}
                    </a-checkbox>
                  </div>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
      </a-row>

      <div class="lib-modal-footer">
        <a-checkbox class="mr-20" :checked="isIncludeVideoQuestion"
          @change="(e) => (isIncludeVideoQuestion = e.target.checked)">
          {{ $t('Include video') }}
        </a-checkbox>

        <app-button type="primary" size="large" @click="onAddQuestionFromLib">
          {{ $t('Add questions') }}
        </app-button>
      </div>
    </a-modal>
  </app-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { format, addDays } from 'date-fns';
import apiRequest from '../js/helpers/apiRequest.js';
import parseJobs from '../js/helpers/parseJobs.js';

import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';
import Card from '../components/Card.vue';
import TextEditor from '../components/TextEditor.vue';
import AppButton from '../components/AppButton.vue';
import Upload from '../components/Upload.vue';
import RadarChart from '../components/RadarChart.vue';
import VideoPlayer from '../components/VideoPlayer.vue';

import IconArrowDown from '../components/icons/ArrowDown.vue';
import IconChevronDown from '../components/icons/ChevronDown.vue';
import IconChevronUp from '../components/icons/ChevronUp.vue';
import IconTime from '../components/icons/Time.vue';
import IconDel from '../components/icons/Del.vue';
import IconQuestion from '../components/icons/Question2.vue';
import IconDefaultLayout from '../components/icons/DefaultLayout.vue';
import IconLeftToRightLayout from '../components/icons/LeftToRightLayout.vue';
import IconAlternativeLayout from '../components/icons/AlternativeLayout.vue';
import IconMore from '../components/icons/More.vue';
import IconSearch from '../components/icons/Search.vue';

Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
  return this;
};

export default {
  name: 'JobEdit',

  components: {
    AppPage,
    PageTitle,
    Card,
    TextEditor,
    AppButton,
    Upload,
    RadarChart,
    VideoPlayer,
    IconArrowDown,
    IconChevronDown,
    IconChevronUp,
    IconTime,
    IconDel,
    IconQuestion,
    IconDefaultLayout,
    IconLeftToRightLayout,
    IconAlternativeLayout,
    IconMore,
    IconSearch
  },

  data() {
    return {
      myFiles: [],
      step: 0,
      pageLoading: false,
      loadQuestions: false,
      loadPublish: false,
      isEditableQuestions: true,
      isAutoeditVisible: false,
      competenceCount: 1,
      dateFormat: 'YYYY/MM/DD',
      headerImagePreview: '',
      steps: [
        this.$t('general_information'),
        this.$t('interview_questions'),
        this.$t('settings')
      ],
      preparationTimes: [
        'Unlim',
        '00:01:00',
        '00:02:00',
        '00:03:00',
        '00:04:00',
        '00:05:00',
        '00:06:00',
        '00:07:00',
        '00:08:00',
        '00:09:00',
        '00:10:00',
        '00:11:00',
        '00:12:00',
        '00:13:00',
        '00:14:00',
        '00:15:00',
        '00:16:00',
        '00:17:00',
        '00:18:00',
        '00:19:00',
        '00:20:00'
      ],
      times: ['00:00:30', '00:01:00', '00:01:30', '00:02:00'],
      times1h: ['00:00:30', '00:01:00', '00:01:30', '00:02:00', '01:00:00'],
      enterpriseTimes: [
        '00:00:30',
        '00:01:00',
        '00:01:30',
        '00:02:00',
        '00:02:30',
        '00:03:00',
        '00:03:30',
        '00:04:00',
        '00:04:30',
        '00:05:00'
      ],
      enterpriseTimes1h: [
        '00:00:30',
        '00:01:00',
        '00:01:30',
        '00:02:00',
        '00:02:30',
        '00:03:00',
        '00:03:30',
        '00:04:00',
        '00:04:30',
        '00:05:00',
        '01:00:00'
      ],
      questionType: [
        {
          name: 'VIDEO',
          title: 'Video'
        },
        {
          name: 'TEST',
          title: 'Quiz'
        },
        {
          name: 'TEXT',
          title: 'Text'
        },
        {
          name: 'CODE',
          title: 'Code'
        }
      ],
      teplates: [
        {
          name: 'BASIC_NEW',
          // nameAlt: 'BASIC_NEW',
          title: 'Main',
          icon: 'icon-alternative-layout'
        },
        {
          name: 'ALTERNATIVE',
          // nameAlt: 'ALTERNATIVE',
          title: 'Standard',
          icon: 'icon-alternative-layout'
        },
        {
          name: 'BASIC',
          // nameAlt: 'BASIC',
          title: 'Block',
          icon: 'icon-default-layout'
        },
        {
          name: 'LEFT_TO_RIGHT',
          title: 'Left to right',
          icon: 'icon-left-to-right-layout'
        }
      ],
      competenses: [],
      pipelines: [],
      currentCompetenseId: undefined,
      autoedit: { value: '', status: '' },
      autoeditData: [],
      autoeditIsIsDescription: true,
      autoeditIsQuestion: true,
      isLibOpen: false,
      libCategories: [],
      currentLibCategory: null,
      checkedQuestion: null,
      selectQuestionIndex: null,
      isIncludeVideoQuestion: true,
      libQuestionsByCategories: [],
      libFilter: {
        search: ''
      },
      data: {
        name: { value: '', status: '' },
        company: { value: undefined, status: '' },
        location: { value: '', status: '' },
        salary: { value: '', status: '' },
        description: { value: '', status: '' },
        headerImage: null,
        template: { value: 'BASIC_NEW', status: '' },
        role: { value: undefined, status: '' },
        questions: [
          {
            questionDefaultId: null,
            isQuestionDefaultEdit: false,
            question: '',
            preparationTime: 'Unlim',
            videoQuestion: null,
            videoFile: null,
            imageFile: null,
            imageFilePreview: null,
            type: 'VIDEO',
            time: '00:00:30',
            lngbcp: 'Default',
            is_count: false,
            points: 0,
            retake: true,
            plagiarism: false,
            tests: [
              {
                correct: false,
                text: ''
              }
            ],
            status: ''
          }
        ],
        inviteExpiry: { value: undefined, status: '' },
        interviewExpiry: { value: undefined, status: '' },
        competences: [],
        pipelines: [],
        cv: false,
        motivationLatter: false,
        forfollowUp: true,
        blockTry: false,
        random_order: false
        // isBlockIpAddress: false
      }
    };
  },

  metaInfo() {
    return {
      title: `HRBLADE | ${this.pageTitle}`
    };
  },

  watch: {
    $route() {
      this.$router.go();
    },

    roles(val) {
      if (val.length) {
        this.autoeditData = val.map((role) => role.name);
      }
    },

    companies(comp) {
      if (!this.isEdit && comp.length === 1) {
        this.data.company.value = this.companies[0].id;
      }
    },

    async currentLibCategory(catId) {
      if (catId !== null) {
        const questions = await apiRequest(
          `role/categories/${catId}`,
          'GET',
          null,
          true
        );

        this.libQuestionsByCategories = questions.response.data;
      }
    }
  },

  computed: {
    isEdit() {
      return this.$route.name === 'jobs-edit-id';
    },

    pageTitle() {
      return this.isEdit
        ? this.$t('page_job_edit.title')
        : this.$t('page_job_create.title');
    },

    chartData() {
      const {
        data: { competences }
      } = this;

      const labels = competences.map((competence) => competence.title);
      const data = competences.map((competence) => competence.value);

      return {
        labels,
        datasets: [
          {
            label: '',
            lineTension: 0.1,
            backgroundColor: 'rgba(253,169,76, 0.2)',
            borderColor: 'rgba(253,169,76, 1)',
            pointBackgroundColor: 'rgba(253,169,76, 1)',
            pointBorderColor: '#ffffff',
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: 'rgba(253,169,76, 1)',
            data
          }
        ]
      };
    },

    libQuestionsByCategoriesFiltred() {
      const {
        libFilter: { search },
        libQuestionsByCategories
      } = this;

      return libQuestionsByCategories.filter((q) => {
        const question = q.question.toLowerCase();
        const searchText = search.toLowerCase();

        return question.indexOf(searchText) >= 0 ? q : false;
      });
    },

    ...mapState({
      appLoading: ({ app }) => app.appLoading,
      bcp: ({ app }) => app.bcp,
      isGenerateQuestions: ({ app }) => app.generateQuestions,
      roles: ({ app }) => app.roles,
      videoQuestionsLimit: ({ user }) => user.plan.questionsLimit,
      isEnterprise: ({ user }) => user.plan.name === 'Enterprise',
      companies: ({ company }) =>
        company.companies.map(({ id, name, style }) => ({
          id,
          name,
          style
        }))
    })
  },

  async created() {
    if (this.isEdit) {
      this.getJob();
    } else {
      this.data.interviewExpiry.value = format(
        addDays(new Date(), 30),
        "yyyy-MM-dd'T'HH:mm:ss"
      );

      if (this.companies.length === 1) {
        this.data.company.value = this.companies[0].id;
      }
    }

    await this.getDefaultOptions();

    const defaultCompetence = this.competenses.find(
      (competence) => competence.isDefault
    );

    if (!this.isEdit) {
      if (defaultCompetence !== undefined) {
        this.onChangeCompetense(defaultCompetence.id);
      }

      this.data.pipelines = this.pipelines;
    }
  },

  methods: {
    getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    },

    onChangePlagiarism(i, e) {
      this.data.questions[i].plagiarism = e;
    },

    disabledDate(current) {
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
      return current.valueOf() <= yesterday;
    },

    onChangeHeaderImage(file) {
      this.data.headerImage = file;
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },

    onChangeCompany(val) {
      const companyStyle = this.companies.find((company) => company.id === val)
        .style;
      this.data.company.value = val;
      if (companyStyle.headerImage) {
        this.headerImagePreview = companyStyle.headerImage;
      }
    },

    onChangeTemplate(e) {
      this.data.template.value = e.target.value;
    },

    onChangeIndustry(val) {
      this.data.industry.value = val;
    },

    onChangeRole(val) {
      this.data.role.value = val;
    },

    onChangeinviteExpiry(val) {
      this.data.inviteExpiry.value = val;
    },

    onChangeFollowUp(val) {
      this.data.forfollowUp = val;
    },

    addNewCompetence() {
      this.data.competences.push({ title: '', value: 0 });
    },

    addNewPipeline() {
      this.data.pipelines.push({ title: '' });
    },

    deleteCompetence(index) {
      const {
        data: { competences }
      } = this;

      competences.splice(index, 1);
    },

    handleUpCompetence(index) {
      if (index !== 0) {
        this.data.competences.move(index, index - 1);
      }
    },

    handleDownCompetence(index) {
      if (this.data.competences.length - 1 !== index) {
        this.data.competences.move(index, index + 1);
      }
    },

    onChangeCompetense(id) {
      this.currentCompetenseId = id;
      this.data.competences = this.competenses.find(
        (competense) => competense.id === id
      ).competences;
    },

    handleUpPipeline(index) {
      if (index !== 0) {
        this.data.pipelines.move(index, index - 1);
      }
    },

    handleDownPipeline(index) {
      if (this.data.pipelines.length - 1 !== index) {
        this.data.pipelines.move(index, index + 1);
      }
    },

    deletePipeline(index) {
      const {
        data: { pipelines }
      } = this;

      pipelines.splice(index, 1);
    },

    checkStep() {
      const { step } = this;
      let valid = true;

      if (step === 0) {
        const {
          data: {
            name,
            company
            // location,
            // salary,
            // description
          }
        } = this;

        name.status = '';
        company.status = '';
        // location.status = '';
        // salary.status = '';
        // description.status = '';

        if (!name.value) {
          name.status = 'error';
          valid = false;
        }

        if (company.value === undefined) {
          company.status = 'error';
          valid = false;
        }

        // if (!location.value) {
        //   location.status = 'error';
        //   valid = false;
        // }

        // if (!salary.value) {
        //   salary.status = 'error';
        //   valid = false;
        // }

        // if (!description.value) {
        //   description.status = 'error';
        //   valid = false;
        // }
      }

      if (step === 1) {
        const {
          data: { questions }
        } = this;

        // industry.status = '';
        // role.status = '';
        questions.forEach((item) => {
          item.status = '';
        });

        // if (industry.value === undefined) {
        //   industry.status = 'error';
        //   valid = false;
        // }

        // if (role.value === undefined) {
        //   role.status = 'error';
        //   valid = false;
        // }

        questions.forEach((item) => {
          if (item.type === 'TEST') {
            const { question, tests } = item;

            if (!question) {
              item.status = 'error';
              valid = false;
            }

            tests.forEach((item) => {
              if (!item.text) {
                item.status = 'error';
                valid = false;
              }
            });

            const correctAnswers = tests.filter((answer) => answer.correct);

            if (!correctAnswers.length) {
              item.status = 'error';
              valid = false;
              this.$notification.error({
                message: this.$t('notify.error'),
                description: 'Нету правильных ответов',
                icon: () => <icon-error class="error-icon" />
              });
            }
          } else {
            const { question } = item;

            if (!question) {
              item.status = 'error';
              valid = false;
            }
          }
        });
      }

      if (step === 2) {
        const {
          data: { inviteExpiry, interviewExpiry }
        } = this;

        inviteExpiry.status = '';
        interviewExpiry.status = '';

        if (
          inviteExpiry.value === undefined &&
          interviewExpiry.value === undefined
        ) {
          inviteExpiry.status = 'warning';
          interviewExpiry.status = 'warning';

          valid = false;
        }
      }

      if (!valid) {
        window.scrollTo(0, 0);
      }

      return valid;
    },

    nextStep() {
      const valid = this.checkStep();

      if (valid) {
        if (this.step !== 2) {
          this.step++;
          window.scrollTo(0, 0);
        } else {
          if (this.isEdit) {
            this.updateInterview();
          } else {
            this.creteInterview();
          }
        }
      }
    },

    onChangeStep(step) {
      const valid = this.checkStep();

      if (this.isEdit && valid) {
        this.step = step;
      }
    },

    onInputQuestionText(index) {
      const q = this.data.questions[index];
      q.isQuestionDefaultEdit = true;
    },

    onBlurQuestionText(index) {
      const q = this.data.questions[index];

      if (q.isQuestionDefaultEdit && q.questionDefaultId !== null) {
        q.videoQuestion = null;
        q.questionDefaultId = null;
      }
    },

    createQuestions() {
      const {
        data: { questions }
      } = this;

      const question = {
        questionDefaultId: null,
        isQuestionDefaultEdit: false,
        preparationTime: 'Unlim',
        question: '',
        videoQuestion: null,
        videoFile: null,
        imageFile: null,
        type: 'VIDEO',
        time: '00:00:30',
        is_count: false,
        retake: true,
        plagiarism: false,
        lngbcp: 'Default',
        points: 0,
        tests: [
          {
            correct: false,
            text: ''
          }
        ],
        status: ''
      };

      questions.push(question);

      this.checkVideoQuestionsLimit();
    },

    checkVideoQuestionsLimit() {
      const videoQuestionCount = this.data.questions.filter(
        (q) => q.type === 'VIDEO'
      ).length;

      if (videoQuestionCount > this.videoQuestionsLimit) {
        this.$notification.warning({
          message: this.$t('notify.warning'),
          description: `${this.$t(
            'Limit of video questions per interview in your plan'
          )}: ${this.videoQuestionsLimit}. ${this.$t(
            'Choose a different question type or upgrade your plan.'
          )}`,
          icon: <icon-error class="error-icon" />
        });
      }
    },

    deleteQuestion(index) {
      const {
        data: { questions }
      } = this;

      questions.splice(index, 1);
    },

    handleUpQuestion(index) {
      if (index !== 0) {
        this.data.questions.move(index, index - 1);
        // arrayMove(this.data.questions, index, index - 1);
      }
    },

    handleDownQuestion(index) {
      if (this.data.questions.length - 1 !== index) {
        this.data.questions.move(index, index + 1);
        // arrayMove(this.data.questions, index, index + 1);
      }
    },

    addAnswer(index) {
      const {
        data: { questions }
      } = this;

      const answer = {
        correct: false,
        text: ''
      };

      questions[index].tests.push(answer);
    },

    deleteAnswer(index, index2) {
      const {
        data: { questions }
      } = this;

      questions[index].tests.splice(index2, 1);
    },

    onCloseLibModal() {
      this.libCategories = [];
      this.currentLibCategory = null;
      this.checkedQuestion = null;
      this.selectQuestionIndex = null;
      this.isIncludeVideoQuestion = true;
      this.libQuestionsByCategories = [];
      this.libFilter.search = '';

      this.isLibOpen = false;
    },

    onAddQuestionFromLib() {
      const {
        selectQuestionIndex,
        checkedQuestion,
        isIncludeVideoQuestion
      } = this;

      if (checkedQuestion !== null) {
        const questionImageFile = this.data.questions[selectQuestionIndex]
          .imageFile;

        this.deleteQuestion(selectQuestionIndex);
        // const currentQuestion = this.data.questions[selectQuestionIndex];
        const checkedQuestionInfo = this.libQuestionsByCategories.find(
          (q) => q.id === checkedQuestion
        );

        this.data.questions.splice(selectQuestionIndex, 0, {
          questionDefaultId: checkedQuestionInfo.id,
          isQuestionDefaultEdit: false,
          question: checkedQuestionInfo.question,
          videoQuestion: isIncludeVideoQuestion
            ? checkedQuestionInfo.video
            : null,
          // videoFile: null,
          imageFile: questionImageFile,
          imageFilePreview: null,
          type: 'VIDEO',
          time: checkedQuestionInfo.time,
          preparationTime: 'Unlim',
          is_count: false,
          retake: true,
          lngbcp: 'Default',
          plagiarism: false,
          points: 0,
          tests: [
            {
              correct: false,
              text: ''
            }
          ],
          status: ''
        });

        this.onCloseLibModal();
      }
    },

    onChangeLibCategory(category) {
      this.currentLibCategory = category;
      this.checkedQuestion = null;
    },

    async onOpenLib(index) {
      const cat = await apiRequest(`role/categories`, 'GET', null, true);

      this.selectQuestionIndex = index;
      this.libCategories = cat.response.data;
      this.currentLibCategory = cat.response.data[0].id;

      this.isLibOpen = true;
    },

    async getJob() {
      try {
        const id = this.$route.params.id;

        this.pageLoading = true;
        const res = await apiRequest(`job/get/${id}`, 'GET', null, true);
        this.pageLoading = false;

        const { error, response } = res;

        if (response.message) {
          this.$notification[error ? 'warning' : 'success']({
            message: error
              ? this.$t('notify.warning')
              : this.$t('notify.success'),
            description: response.message,
            icon: () =>
              error ? (
                <icon-error class="error-icon" />
              ) : (
                <icon-success class="success-icon" />
              )
          });
        }

        if (error) {
          this.$router.push('/');
        } else {
          const info = parseJobs(res.response.data);
          const {
            data: {
              name,
              company,
              location,
              salary,
              description,
              template,
              // industry,
              role,
              inviteExpiry,
              interviewExpiry
            }
          } = this;

          name.value = info.name;
          company.value = info.companyId;
          location.value = info.location;
          salary.value = info.salary;
          description.value = info.description;
          this.headerImagePreview = info.style.headerImage;
          template.value = info.style.template;
          // industry.value = info.industryId;
          role.value = info.roleId;
          inviteExpiry.value = info.inviteExpiry;
          interviewExpiry.value = info.interviewExpiry;
          this.data.questions = info.questions;
          this.data.competences = info.competences;
          this.data.pipelines = info.pipelines;
          this.data.forfollowUp = info.forfollowUp;
          this.data.cv = info.cv;
          this.data.motivationLatter = info.motivationLatter;
          this.data.blockTry = info.blockTry;
          this.data.random_order = info.random_order;

          if (info.responses.length) {
            this.isEditableQuestions = false;
          }
        }
      } catch (error) {
        console.log('getJob:', error);
      }
    },

    async getDefaultOptions() {
      try {
        const { locale } = this.$i18n;
        const res = await apiRequest(
          `competenses/sets/${locale}`,
          'GET',
          null,
          true
        );

        if (!res.error) {
          const {
            data: { sets, pipelines }
          } = res.response;

          this.competenses = sets.map(
            ({ id, name, default: isDefault, competences }) => ({
              id,
              name,
              isDefault: !!isDefault,
              competences: competences.map(({ name, score }) => ({
                title: name,
                value: score
              }))
            })
          );

          this.pipelines = pipelines.map(
            ({ id, name, default: isDefault }) => ({
              id,
              name,
              isDefault: !!isDefault
            })
          );
        }
      } catch (error) {
        console.log(`error`, error);
      }
    },

    async generateQuestions() {
      try {
        const { autoedit } = this;

        if (!autoedit.value) {
          this.$notification.warning({
            message: this.$t('notify.warning'),
            description: 'Please select role',
            icon: () => <icon-error class="warning-icon" />
          });
        } else {
          const currentRole = this.roles.find(
            (role) => role.name === autoedit.value
          );
          this.loadQuestions = true;
          const res = await apiRequest(
            `role/questions/${currentRole.id}`,
            'GET',
            null,
            true
          );
          this.loadQuestions = false;

          if (res.error) {
            console.log('generateQuestions:', res);
          } else {
            const { data } = res.response;

            if (!this.data.name.value.length) {
              this.data.name.value = currentRole.name;
            }

            if (this.autoeditIsIsDescription) {
              this.data.description.value = currentRole.description;
            }

            if (this.autoeditIsQuestion) {
              this.data.questions = data.map(
                ({
                  id,
                  question,
                  video,
                  time,
                  is_count,
                  points,
                  type,
                  tests
                }) => ({
                  type: type || 'VIDEO',
                  questionDefaultId: id,
                  isQuestionDefaultEdit: false,
                  question,
                  videoQuestion: video,
                  videoFile: null,
                  imageFile: null,
                  imageFilePreview: null,
                  time,
                  status: '',
                  lngbcp: 'Default',
                  retake: true,
                  plagiarism: false,
                  preparationTime: 'Unlim',
                  is_count: is_count ? !!is_count : false,
                  points: points ? points : 0,
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
            }

            this.$notification.success({
              message: this.$t('notify.success'),
              description: this.$t('notify.questions_have_been_filled'),
              icon: () => <icon-success class="success-icon" />
            });
          }
        }
      } catch (error) {
        console.log('generateQuestions:', error);
      }
    },

    async creteInterview() {
      try {
        const body = new FormData();
        const {
          data: {
            name,
            company,
            location,
            salary,
            description,
            headerImage,
            template,
            // industry,
            role,
            questions,
            inviteExpiry,
            interviewExpiry,
            competences,
            pipelines,
            forfollowUp,

            cv,
            motivationLatter,
            blockTry,
            random_order
          }
        } = this;

        body.append('name', name.value);
        body.append('company_id', company.value);
        body.append('salary', salary.value);
        body.append('location', location.value);
        body.append('description', description.value);
        body.append('template', template.value);
        body.append('ask_cv', Number(cv));
        body.append('ask_motivation_letter', Number(motivationLatter));
        // body.append('industry_id', industry.value);
        body.append('for_follow_up', Number(forfollowUp));
        body.append('block_try', Number(blockTry));
        body.append('random_order', Number(random_order));

        if (headerImage) {
          body.append('header_image', headerImage);
        }

        if (role.value !== undefined) {
          body.append('role_id', role.value);
        }

        if (inviteExpiry.value !== undefined) {
          body.append('expire_days', inviteExpiry.value);
        }

        if (interviewExpiry.value !== undefined) {
          body.append('expire_date', interviewExpiry.value);
        }

        questions.forEach((item, i) => {
          const {
            type,
            question,
            questionDefaultId,
            videoQuestion,
            imageFile,
            videoFile,
            preparationTime,
            time,
            is_count,
            points,
            retake,
            plagiarism,
            tests,
            lngbcp
          } = item;

          if (type === 'TEST') {
            body.append(
              `questions[${i}]`,
              JSON.stringify({
                default_id: questionDefaultId,
                type,
                question,
                video: videoQuestion ? videoQuestion : null,
                time,
                preparation_time: preparationTime,
                is_count,
                points,
                retake: preparationTime !== 'Unlim' ? 0 : Number(retake),
                copyscape_check: Number(plagiarism),
                tests,
                sorting: i,
                language_answer: lngbcp
              })
            );
          } else {
            body.append(
              `questions[${i}]`,
              JSON.stringify({
                default_id: questionDefaultId,
                type,
                question,
                video: videoQuestion ? videoQuestion : null,
                time,
                preparation_time: preparationTime,
                sorting: i,
                retake: preparationTime !== 'Unlim' ? 0 : Number(retake),
                copyscape_check: Number(plagiarism),
                language_answer: lngbcp
              })
            );
          }

          if (imageFile) {
            body.append(`image[${i}]`, imageFile);
          }

          if (videoFile) {
            body.append(`video[${i}]`, videoFile);
          }

          body.append('language_answer', lngbcp);
        });

        competences.forEach((item, i) => {
          body.append(
            `competences[${i}]`,
            JSON.stringify({
              name: item.title,
              score: item.value,
              sort: i
            })
          );
        });

        pipelines.forEach((item, i) => {
          body.append(
            `pipelines[${i}]`,
            JSON.stringify({
              name: item.name,
              sort: i
            })
          );
        });

        this.loadPublish = true;
        const res = await apiRequest('job/create', 'POST', body, true);
        this.loadPublish = false;

        const { error, response } = res;

        if (response.message) {
          this.$notification[error ? 'warning' : 'success']({
            message: error
              ? this.$t('notify.warning')
              : this.$t('notify.success'),
            description: response.message,
            icon: () =>
              error ? (
                <icon-error class="error-icon" />
              ) : (
                <icon-success class="success-icon" />
              )
          });
        }

        if (!error) {
          const {
            data: { id }
          } = res.response;
          this.getCompanies();
          this.getJobs();
          this.$router.push(`/jobs/invite/${id}`);
        }
      } catch (error) {
        console.log('creteInterview:', error);
        this.loadPublish = false;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }
    },

    async updateInterview() {
      try {
        const body = new FormData();
        const jobId = this.$route.params.id;
        const {
          data: {
            name,
            company,
            location,
            salary,
            description,
            headerImage,
            template,
            // industry,
            role,
            questions,
            inviteExpiry,
            interviewExpiry,
            competences,
            pipelines,
            forfollowUp,
            cv,
            motivationLatter,
            blockTry,
            random_order
          }
        } = this;

        body.append('job_id', jobId);
        body.append('name', name.value);
        body.append('company_id', company.value);
        body.append('location', location.value);
        body.append('salary', salary.value);
        body.append('description', description.value);
        body.append('template', template.value);
        body.append('ask_cv', Number(cv));
        body.append('ask_motivation_letter', Number(motivationLatter));
        // body.append('industry_id', industry.value);
        body.append('for_follow_up', Number(forfollowUp));
        body.append('block_try', Number(blockTry));
        body.append('random_order', Number(random_order));

        if (headerImage) {
          body.append('header_image', headerImage);
        } else {
          body.append('header_image', 'clear');
        }

        if (role.value && role.value !== undefined) {
          body.append('role_id', role.value);
        }

        if (inviteExpiry.value !== undefined) {
          body.append('expire_days', inviteExpiry.value);
        }

        if (interviewExpiry.value !== undefined) {
          body.append('expire_date', interviewExpiry.value);
        }

        questions.forEach((item, i) => {
          const {
            question_id,
            questionDefaultId,
            type,
            question,
            videoQuestion,
            imageFile,
            imageFilePreview,
            videoFile,
            time,
            preparationTime,
            is_count,
            points,
            retake,
            plagiarism,
            tests,
            lngbcp
          } = item;

          if (type === 'TEST') {
            body.append(
              `questions[${i}]`,
              JSON.stringify({
                question_id,
                default_id: questionDefaultId,
                type,
                question,
                video: videoQuestion ? videoQuestion : null,
                time,
                preparation_time: preparationTime,
                is_count,
                points,
                retake: preparationTime !== 'Unlim' ? 0 : Number(retake),
                copyscape_check: Number(plagiarism),
                tests,
                sorting: i,
                language_answer: lngbcp
              })
            );
          } else {
            body.append(
              `questions[${i}]`,
              JSON.stringify({
                question_id,
                default_id: questionDefaultId,
                type,
                question,
                video: videoQuestion ? videoQuestion : null,
                time,
                preparation_time: preparationTime,
                sorting: i,
                retake: preparationTime !== 'Unlim' ? 0 : Number(retake),
                copyscape_check: Number(plagiarism),
                language_answer: lngbcp
              })
            );
          }

          if (imageFile) {
            body.append(`image[${i}]`, imageFile);
          }
          if (!imageFile && !imageFilePreview) {
            body.append(`image[${i}]`, 'clear');
          }

          if (videoFile) {
            body.append(`video[${i}]`, videoFile);
          }
        });

        competences.forEach((item, i) => {
          if (item.id) {
            body.append(
              `competences[${i}]`,
              JSON.stringify({
                competnece_id: item.id,
                name: item.title,
                score: item.value,
                sort: i
              })
            );
          } else {
            body.append(
              `competences[${i}]`,
              JSON.stringify({
                name: item.title,
                score: item.value,
                sort: i
              })
            );
          }
        });

        pipelines.forEach((item, i) => {
          if (item.id) {
            body.append(
              `pipelines[${i}]`,
              JSON.stringify({
                pipelines_id: item.id,
                name: item.name,
                sort: i
              })
            );
          } else {
            body.append(
              `pipelines[${i}]`,
              JSON.stringify({
                name: item.name,
                sort: i
              })
            );
          }
        });

        this.loadPublish = true;
        const res = await apiRequest('job/update', 'POST', body, true);
        this.loadPublish = false;

        const { error, response } = res;

        if (response.message) {
          this.$notification[error ? 'warning' : 'success']({
            message: error
              ? this.$t('notify.warning')
              : this.$t('notify.success'),
            description: response.message,
            icon: () =>
              error ? (
                <icon-error class="error-icon" />
              ) : (
                <icon-success class="success-icon" />
              )
          });
        }

        if (!error) {
          this.getJobs();
          this.$router.back();
        }
      } catch (error) {
        console.log('creteInterview:', error);
        this.loadPublish = false;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }
    },

    ...mapActions({
      getCompanies: 'company/getCompanies',
      getJobs: 'jobs/getJobs'
    })
  }
};
</script>

<style lang="scss">
.template-radio-group {
  .ant-radio-wrapper {
    display: flex;
    align-items: center;
  }
}

.template-radio-group-item {
  display: flex;
  align-items: center;

  svg {
    width: 30px;
    height: 30px;
    margin-right: 15px;
  }
}

.competencies-list {
  margin-top: 40px;
}

.competencies-list-item {
  display: flex;
  align-items: center;

  +.competencies-list-item {
    margin-top: 10px;
  }

  .ant-input {
    @media (max-width: $sm) {
      font-size: 14px;
    }
  }
}

.competencies-list-item-title {
  flex-basis: 100%;
  margin-right: 10px;

  .page-title {
    @media (max-width: $sm) {
      font-size: 14px;
    }
  }
}

.competencies-list-item-rate {
  width: 120px;
  flex-shrink: 0;
  margin-right: 10px;

  .page-title {
    @media (max-width: $sm) {
      font-size: 14px;
    }
  }
}

.competencies-list-item-actions {
  width: 105px;
  flex-shrink: 0;
}

.question-item {
  +.question-item {
    margin-top: 20px;
  }

  >.card-inner {
    >.ant-form-item {
      margin-bottom: 0;
    }
  }

  .ant-form-item-children {
    display: block;
  }
}

.page-job-edit-autoedit {
  margin-bottom: 20px;
  padding: 35px;
  border-radius: 5px;
  background-color: #f9f9fa;

  @media (max-width: $sm) {
    padding: 10px;
  }

  .ant-form-item {
    margin-bottom: 0;
  }
}

.page-job-edit-autoedit-settings {
  display: flex;
  align-items: center;

  @media (max-width: $sm) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.page-job-edit-autoedit-settings-controls {
  margin-left: 10px;
  display: flex;

  @media (max-width: $sm) {
    flex-direction: column;
    margin-left: 0;
  }

  .ant-checkbox-wrapper {
    @media (max-width: $sm) {
      margin-top: 10px;
    }

    +.ant-checkbox-wrapper {
      @media (max-width: $sm) {
        margin-left: 0;
      }
    }
  }
}

.question-item-footer {
  margin-top: 30px;
  font-size: 12px;
  color: #7b7c86;
}

.question-item-options {
  // display: flex;
  // flex-direction: column;
  // text-align: right;

  // @media (max-width: $sm) {
  //   text-align: left;
  // }

  .ant-checkbox-wrapper+.ant-checkbox-wrapper {
    margin-left: 0;
    margin-top: 10px;
  }
}

// .question-item-video {
//   margin-top: 20px;
//   position: relative;
//   max-width: 50%;

//   @media (max-width: $sm) {
//     max-width: 100%;
//   }
// }

.job-edit-footer-actions {
  margin-top: 40px;
  display: flex;
  justify-content: end;
}

.lib-modal-btn {
  text-align: left;
  border: 0;
  box-shadow: none;
  height: 35px;

  &:hover {
    background-color: #f8f8f8;
  }

  &.lib-modal-btn-current {
    background-color: rgba(#ffab42, 0.2);
  }

  +.lib-modal-btn {
    margin-top: 5px;
  }
}

.lib-modal-questions {
  height: 400px;
  padding: 5px;
  overflow: auto;

  @media (max-width: $sm) {
    height: auto;
  }

  .ant-checkbox-wrapper {
    display: flex;

    +.ant-checkbox-wrapper {
      margin-left: 0;
      margin-top: 10px;
    }
  }
}

.lib-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-radius: 6px;
  padding: 10px;
  background-color: #f9f9fa;

  @media (max-width: $sm) {
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  .ant-checkbox-wrapper {
    @media (max-width: $sm) {
      margin-bottom: 20px;
    }
  }
}

.page-job-edit-autoedit-toggle {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;

  button {
    font-size: 14px;
    font-weight: 600;
    padding: 10px 20px;
    border: 0;
    border-radius: 5px;
    background-color: #f9f9fa;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background-color: darken(#f9f9fa, 3%);
    }
  }
}
</style>
