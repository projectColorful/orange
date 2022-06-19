/* eslint-disable no-param-reassign */
const paginate = (query, params) => {
  const result = {
    rows: query.rows, // 조회된 열
    offset: 0, // 시작 인덱스
    limit: Number(params.limit), // 조회할 갯수
    count: 0, // 전체 열 갯수
  };

  if (query.rowCount > 0) {
    // 조회한 열에 역순으로 번호를 매기면 첫번째 열에 마지막 열 번호(조회된 전체 열 갯수)가 포함됨
    // 조회 시작 인덱스에 조회한 첫번째 열의 번호를 더하면 조회된 전체 열 갯수가 됨
    result.count = Number(query.rows[0].row_count_for_pagination) + Number(params.offset);
    result.offset = Number(params.offset);
    query.rows.forEach((row) => delete row.row_count_for_pagination);
  }

  return result;
};

module.exports = {
  paginate,
};
