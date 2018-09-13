import {
  Button,
  EmptyState,
  FormControl,
  Icon,
  ModalTrigger
} from 'modules/common/components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Column, Columns, Footer, Title } from '../styles/chooser';
import { CenterContent, ModalFooter } from '../styles/main';

type Props = {
  data: any,
  onSelect?: (datas: any[]) => void,
  search: (value: string, reload?: boolean) => void,
  datas: any[],
  form: React.ReactNode,
  title: string,
  renderName?: (data: any) => void,
  perPage: number,
  clearState: () => void,
  limit?: number,
  add?: any
};

type State = {
  datas: any[],
  loadmore: boolean,
  searchValue: string
}

class CommonChooser extends Component<Props, State> {
  static contextTypes = {
    closeModal: PropTypes.func.isRequired,
  };

  private timer: NodeJS.Timer

  constructor(props) {
    super(props);

    const datas = this.props.data.datas || [];

    this.state = {
      datas,
      loadmore: true,
      searchValue: ''
    };

    this.onSelect = this.onSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  onSelect() {
    this.props.onSelect(this.state.datas);
    this.context.closeModal();
  }

  componentWillUnmount() {
    this.props.clearState();
  }

  componentWillReceiveProps(newProps) {
    const { datas, perPage } = newProps;

    this.setState({ loadmore: datas.length === perPage });
  }

  handleChange(type, data) {
    const { datas } = this.state;

    if (type === 'add') {
      if (this.props.limit && this.props.limit === datas.length) {
        return;
      }

      this.setState({ datas: [...datas, data] });
    } else {
      this.setState({ datas: datas.filter(item => item !== data) });
    }
  }

  search(e) {
    if (this.timer) clearTimeout(this.timer);

    const { search } = this.props;
    const value = e.target.value;

    this.timer = setTimeout(() => {
      search(value);
      this.setState({ searchValue: value });
    }, 500);
  }

  loadMore() {
    this.setState({ loadmore: false });
    this.props.search(this.state.searchValue, true);
  }

  renderRow(data, icon) {
    if (icon === 'add' && this.state.datas.some(e => e._id === data._id)) {
      return null;
    }

    return (
      <li key={data._id} onClick={() => this.handleChange(icon, data)}>
        {this.props.renderName(data)}
        <Icon icon={icon} />
      </li>
    );
  }

  renderSelected(selectedDatas) {
    if (selectedDatas.length) {
      return (
        <ul>
          {selectedDatas.map(data => this.renderRow(data, 'minus-circle'))}
        </ul>
      );
    }

    return <EmptyState text="No items added" icon="list-2" />;
  }

  render() {
    const { datas, form, title, data } = this.props;
    const selectedDatas = this.state.datas;
    const { __ } = this.context;

    const addTrigger = (
      <p>
        {__("Don't see the result you're looking for? ")}
        <a>{__(`Create a new ${title}`)}</a>
      </p>
    );

    return (
      <div>
        <Columns>
          <Column>
            <FormControl
              placeholder={__('Type to search')}
              onChange={e => this.search(e)}
            />
            <ul>
              {datas.map(data => this.renderRow(data, 'add'))}
              {this.state.loadmore && (
                <CenterContent>
                  <Button
                    size="small"
                    btnStyle="primary"
                    onClick={this.loadMore}
                    icon="checked-1"
                  >
                    Load More
                  </Button>
                </CenterContent>
              )}
            </ul>
          </Column>
          <Column>
            <Title>
              {data.name}&apos;s {title}
              <span>({selectedDatas.length})</span>
            </Title>
            {this.renderSelected(selectedDatas)}
          </Column>
        </Columns>
        <ModalFooter>
          <Footer>
            <ModalTrigger title={`New ${title}`} trigger={addTrigger} size="lg">
              {form}
            </ModalTrigger>
            <div>
              <Button
                btnStyle="simple"
                onClick={() => this.context.closeModal()}
                icon="cancel-1"
              >
                Cancel
              </Button>
              <Button
                btnStyle="success"
                onClick={this.onSelect}
                icon="checked-1"
              >
                Select
              </Button>
            </div>
          </Footer>
        </ModalFooter>
      </div>
    );
  }
}

export default CommonChooser;