import {
  Button,
  Card,
  Center,
  Container,
  Flex,
  Grid,
  Group,
  Header,
  Image,
  MultiSelect,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
  createStyles,
  rem,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import logo from '../../assets/img/logo.png';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { foodActions } from '../../reducers/food/food.action';
import { tableActions } from '../../reducers/table/table.action';
import { RootState } from '../../redux/reducer';
import { FoodStatus } from '../../types/models/food';
import { TableStatus } from '../../types/models/table';
import FoodCard from './FoodCard/FoodCard';

const HEADER_HEIGHT = rem(60);

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

function AppLayout() {
  const { classes } = useStyles();

  const { foods } = useSelector((state: RootState) => state.food);
  const { tables } = useSelector((state: RootState) => state.table);

  const tableData = useMemo(
    () =>
      tables
        .filter((table) => table.status === TableStatus.FREE)
        .map((table) => ({ value: table.id.toString(), label: table.name })),
    [tables]
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(foodActions.getAllFoods());
    dispatch(tableActions.getAllTables());
  }, []);

  const form = useForm({
    initialValues: {
      name: '',
      phone: '',
      address: '',
      tableIDS: [],
    },
    validate: {
      name: isNotEmpty('Tên khách hàng không thể bỏ trống!'),
      phone: isNotEmpty('Số điệnthoại khách hàng không thể bỏ trống!'),
      address: isNotEmpty('Địa chỉ khách hàng không thể bỏ trống!'),
      tableIDS: isNotEmpty('Bạn chưa chọn bàn cho khách hàng!'),
    },
  });

  return (
    <>
      <Header height={HEADER_HEIGHT} mb={40} className={classes.root}>
        <Container className={classes.header}>
          <Image src={logo} height={52.07} width={160} />
          <Group spacing={5} className={classes.links}>
            <Text fz="sm">Trang đặt bàn & gọi món</Text>
          </Group>
        </Container>
      </Header>

      <Container>
        <form
          id="form-add-modal"
          onSubmit={form.onSubmit((values) => {
            console.log(values);
          })}
        >
          <Flex direction="column" gap="sm">
            <Grid>
              <Grid.Col span={5}>
                <Center>
                  <Title order={3} mb="sm">
                    Thông tin khách hàng
                  </Title>
                </Center>
                <Card withBorder>
                  <Stack>
                    <TextInput
                      withAsterisk
                      label="Tên khách hàng"
                      placeholder="Nhập tên khách hàng"
                      {...form.getInputProps('name')}
                    />

                    <TextInput
                      withAsterisk
                      label="Số điện thoại"
                      placeholder="Nhập số điện thoại khách hàng"
                      {...form.getInputProps('phone')}
                    />

                    <TextInput
                      withAsterisk
                      label="Địa chỉ"
                      placeholder="Nhập địa chỉ khách hàng"
                      {...form.getInputProps('address')}
                    />

                    <MultiSelect
                      withAsterisk
                      zIndex={100000}
                      label="Bàn"
                      placeholder="Chọn bàn đặt"
                      data={tableData}
                      clearable
                      searchable
                      // itemComponent={ItemTable}
                      {...form.getInputProps('tableIDS')}
                    />
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={7}>
                <Center>
                  <Title order={3} mb="sm">
                    Gọi món
                  </Title>
                </Center>
                <Card withBorder>
                  <Stack>
                    <ScrollArea h={500}>
                      <Stack>
                        {foods
                          .filter((food) => food.status === FoodStatus.active)
                          .map((item, index) => (
                            <FoodCard
                              setOrderedFoods={() => {}}
                              orderedFoods={[]}
                              key={`food-card-${index}`}
                              item={item}
                            />
                          ))}
                      </Stack>{' '}
                    </ScrollArea>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
            <Group mt="sm" position="right">
              <Button variant="light" color="orange.9">
                Huỷ bỏ
              </Button>
              <Button type="submit" color="orange.9">
                Đặt bàn
              </Button>
            </Group>
          </Flex>
        </form>
      </Container>
    </>
  );
}

export default AppLayout;
