<template lang="pug">
section.section.deploy-data-page
  .container
    h1.title Activity Data
    h2.subtitle Download daily or hourly step counts to an excel file for each avatar in the deployment

  hr

  api-block(
      ref="users",
      :endpoint="fetchUsers",
      v-model="deploymentUsers",
      loading="Fetching Users"
    )

  .container
    .columns
      .column.is-size-6.is-offset-3
        h3.has-text-grey Baseline Period
        p.is-size-4
          | {{formatDate(deployment.baselineFrom)}}
          |
          fa(icon="arrow-right", size="sm")
          |
          | {{formatDate(deployment.baselineTo)}}
      .column.is-half
        p.is-size-6.has-text-grey Activity Period
        p.is-size-4
          | {{formatDate(deployment.activityFrom)}}
          |
          fa(icon="arrow-right", size="sm")
          |
          | {{formatDate(deployment.activityTo)}}

  .data-export
    .columns
      .column.is-3.is-offset-3
        control(label="From", :left-icon="['far', 'calendar']")
          date-picker(v-model="start", name="start", input-class="input", placeholder="Download data from", @selected="disableDownloadButton" required)
      .column.is-3
        control(label="To", :left-icon="['far', 'calendar']")
          date-picker(v-model="end", name="end", input-class="input", placeholder="Download data to", @selected="disableDownloadButton", required)

    .columns
      .column.is-6.is-offset-3
        control(label="Group data by hour or day", left-icon="clock")
          .select.is-fullwidth
            select(v-model="groupBy", v-on:click="disableDownloadButton")
              option(disabled, value="") Please Select
              option(value="HOUR") Group by hourly step counts per avatar
              option(value="DAY") Group by daily step counts per avatar
              //- option(value="WEEK") Group by weekly step counts per avatar
    .columns
        .column
          .buttons.is-centered
            button.button.is-link(@click="submit") Submit
    hr

    json-excel(
      v-if="downloadLinkVisible"
      :data="file.data"
      :fields="file.fields"
      :name="file.filename"
    )
      .columns
        .column
          .buttons.is-centered
            button.button.is-primary(v-if="downloadLinkVisible") Download File
</template>

<script>
import Control from '@/components/layout/Control'
import DatePicker from 'vuejs-datepicker'
import moment from 'moment-mini'
import ApiBlock from '@/components/layout/ApiBlock'
import JsonExcel from 'vue-json-excel'
import { OrgParamMixin, DeploymentParamMixin } from '@/mixins'

export default {
  components: { Control, DatePicker, ApiBlock, JsonExcel },
  mixins: [ OrgParamMixin, DeploymentParamMixin ],
  props: {
  },
  data () {
    return {
      start: null,
      end: null,
      deploymentUsers: null,
      query: null,
      groupBy: null,
      file: {
        filename: null,
        data: [],
        fields: {}
      },
      downloadLinkVisible: false,
      timeRanges: {
        maxHours: 48,
        maxDays: 31,
        maxWeeks: 52
      }
    }
  },
  computed: {
  },
  methods: {
    formatDate (date) {
      return moment(date).format('Do MMM YY')
    },
    disableDownloadButton () {
      this.downloadLinkVisible = false
      this.file = {
        filename: null,
        data: [],
        fields: {}
      }
    },
    async submit () {
      this.start = new Date(new Date(this.start).setHours(0, 0, 0))
      this.end = new Date(new Date(this.end).setHours(23, 59, 59))

      if (this.start > this.end) {
        alert('Start date must be before end date')
        return
      } else {
        let hoursBetweenStartAndEnd = Math.abs(this.end - this.start) / (60 * 60 * 1000)
        let daysBetweenStartAndEnd = Math.abs(this.end - this.start) / (24 * 60 * 60 * 1000)
        // let weeksBetweenStartAndEnd = Math.abs(this.end - this.start) / (7 * 24 * 60 * 60 * 1000)

        switch (this.groupBy) {
          case 'HOUR':
            if (hoursBetweenStartAndEnd > this.timeRanges.maxHours) {
              alert(`You can only group data by hours for a maximum of ${this.timeRanges.maxHours} hours, please use daily or weekly for this query instead`)
              return
            }
            break
          case 'DAY':
            if (daysBetweenStartAndEnd > this.timeRanges.maxDays) {
              alert(`You can only group data by days for a maximum of ${this.timeRanges.maxDays} days, please use a smaller range or weekly for this query instead`)
              return
            }
            break
          // case 'WEEK':
          //   if (weeksBetweenStartAndEnd > this.timeRanges.maxWeeks) {
          //     alert(`You can only group data by weeks for a maximum of ${this.timeRanges.maxWeeks} weeks, please use a smaller range for this query instead`)
          //     return
          //   }
          //   break
          default:
            return
        }
      }

      let { meta, data } = await this.$api.getDeviceData(
        this.deploymentId,
        this.deploymentUsers.map(deploymentUser => deploymentUser.id),
        this.start.toISOString(),
        this.end.toISOString(),
        1,
        this.groupBy
      )

      if (!meta.success) {
        console.log(meta)
      } else {
        // console.log(data)
        this.query = data

        // let dateColumns = {}
        let deploymentAvatarLookup = {}
        this.deploymentUsers.forEach((deploymentUser) => {
          deploymentAvatarLookup[deploymentUser.id] = `${deploymentUser.colour} ${deploymentUser.animal}`
        })

        this.file.fields['Avatar'] = 'avatar'

        Object.keys(data).forEach((deploymentUserId) => {
          let row = {}
          row['avatar'] = deploymentAvatarLookup[deploymentUserId]
          console.log(row['avatar'])
          // get timestamps for columns in csv
          // if (Object.keys(dateColumns).length !== Object.keys(data[deploymentUserId]).length) {
          // convert timestamps to date strings
          // dateColumns = Object.keys(data[deploymentUserId]).map(timestamp => new Date(timestamp).toISOString())
          // this.file.fields = {
          //   "Avatar": "avatar",
          //   "Wednesday 13th ... 2018": "123456"
          //   "123457": "123457"
          //   "123458": "123458"
          //   "123459": "123459"
          // }
          // this.file.data = [
          //   {
          //     "avatar": "blue squid",
          //     "123456": 14
          //     "123457": 2
          //     "123458": 0
          //     "123459": 59
          //   },
          //   {
          //     "avatar": "red bear",
          //     "123456": 0
          //     "123457": 2
          //     "123458": 0
          //     "123459": 5
          //   },
          // ]
          // }

          for (let timestamp in data[deploymentUserId]) {
            let dateTimestamp = (new Date(parseInt(timestamp) * 1000)).toLocaleString('en-GB')

            if (!this.file.fields.hasOwnProperty(dateTimestamp)) {
              this.file.fields[dateTimestamp] = timestamp
            }

            // if (!this.file.fields.hasOwnProperty(timestamp)) {
            //   this.file.fields[timestamp] = timestamp
            // }

            row[timestamp] = parseInt(data[deploymentUserId][timestamp])
          }

          this.file.data.push(row)
        })

        this.file.filename = `ThinkActive.io - ${this.groupBy} step count - ${new Date().toLocaleString('en')}.xls`
        this.downloadLinkVisible = true
      }
    },
    fetchUsers () {
      return this.$api.getDeploymentUsers(this.deployment.id)
    }
  }
}
</script>

<style lang="css">
</style>
