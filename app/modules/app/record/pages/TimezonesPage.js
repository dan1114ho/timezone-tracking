import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Segment, Table, Header, Container, Dimmer, Loader, Button, Confirm } from 'semantic-ui-react';
import Pagination from 'components/Pagination';
import NameFilter from 'components/NameFilter';
import { recordListRequest, recordDeleteRequest } from '../redux/actions';
import { makeSelectRecordList, makeSelectRecordListLoading } from '../redux/selectors';

class TimezonesPage extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      deleteId: null,
      showDeleteConfirm: false,
      page: 1,
      pageSize: 9,
      searchTerm: ''
    };
  }

  componentWillMount() {
    this.props.recordList();
  }

  onChangePage = (page) => {
    this.setState({ page });
  }

  onRemove = (deleteId) => () => {
    this.setState({ deleteId, showDeleteConfirm: true });
  }

  onChangeFilter = (filterName, value) => {
    this.setState({ [filterName]: value });
  };

  handleConfirm = () => {
    this.props.recordDelete(this.state.deleteId);
    this.setState({ showDeleteConfirm: false });
  }

  handleCancel = () => this.setState({ showDeleteConfirm: false })

  getCurrentTime = (difference) => {
    const posNum = (difference < 0 ? difference * -1 : difference);
    const utcMoment = moment.utc();
    if (difference < 0) {
      return moment.utc().subtract(posNum, 'hours').format('MM/DD/YY h:mm:ss a');
    }
    else {
      return moment.utc().add(posNum, 'hours').format('MM/DD/YY h:mm:ss a');
    }
  }

  getDifferenceToBrowserTime = (difference) => {
    const currentTime = this.getCurrentTime(difference);
    const now = moment(new Date());
    return Math.floor(moment.duration(now.diff(currentTime)).asHours());
  }

  renderRecords = (records) => {
    const { page, pageSize } = this.state;

    if (!records.size) {
      return (
        <Table.Row>
          <Table.Cell colSpan="6">
            No Records
          </Table.Cell>
        </Table.Row>
      );
    }
    
    return records.slice((page - 1) * pageSize, page * pageSize).map((record) => (
      <Table.Row key={record.get('_id')}>
        <Table.Cell>
          {record.getIn(['user', 'userName'])}
        </Table.Cell>
        <Table.Cell>
          {record.get('name')}
        </Table.Cell>
        <Table.Cell>
          {record.get('city')}
        </Table.Cell>
        <Table.Cell>
          {this.getCurrentTime(record.get('difference'))}
        </Table.Cell>
        <Table.Cell>
          {this.getDifferenceToBrowserTime(record.get('difference'))}
        </Table.Cell>
        <Table.Cell>
          <Button color="teal" size="mini" as={Link} to={`/records/${record.get('_id')}`} content="Edit" icon="edit" labelPosition="left" />
          &nbsp;
          <Button color="orange" size="mini" content="Remove" icon="trash" labelPosition="left" onClick={this.onRemove(record.get('_id'))} />
        </Table.Cell>
      </Table.Row>
    ));
  }

  render() {
    const { records, loading } = this.props;
    const { page, pageSize, showDeleteConfirm, searchTerm } = this.state;
    const filteredRecords = records.filter((record) => {
      return record.get('name').toLowerCase().search(searchTerm.toLowerCase()) !== -1
    });

    return (
      <Container>
        <Confirm
          open={showDeleteConfirm}
          content="Are you sure to delete this record?"
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
        <Dimmer active={loading}>
          <Loader />
        </Dimmer>
        <div style={{ paddingTop: '20px', paddingBottom: '5px' }}>
          <span style={{ color: '#00b5ad', fontSize: '24px', fontWeight: 'bold' }}>Timezones</span>
        <Button color="teal" as={Link} to="/records/new" style={{ float: 'right' }}>Add New Timezone</Button>
        </div>
        <Segment>
          <Header as="h4" content="Filter" dividing color="teal" />
          <NameFilter
            searchTerm={searchTerm}
            onChange={this.onChangeFilter}
          />
        </Segment>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>User</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>City</Table.HeaderCell>
              <Table.HeaderCell>Current Time</Table.HeaderCell>
              <Table.HeaderCell>Difference to Brower (hours)</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.renderRecords(filteredRecords)}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="6">
                <Pagination
                  total={filteredRecords.size}
                  currentPage={page}
                  onChange={this.onChangePage}
                  perPage={pageSize}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Container>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  records: makeSelectRecordList(),
  loading: makeSelectRecordListLoading(),
});

const mapDispatchToProps = {
  recordList: recordListRequest,
  recordDelete: recordDeleteRequest,
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(TimezonesPage);
